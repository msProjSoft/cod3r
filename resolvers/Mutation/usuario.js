const bcrypt = require('bcrypt-nodejs')
const db = require('../../config/db')

const {perfil: obterPerfil} = require('../Query/perfil')
const {usuario: obterUsuario} = require('../Query/usuario')


const mutations = {

    registrarUsuario(_, {dados}) {
        ctx && ctx.validarAdmin()
        return mutations.novoUsuario(_, {
            dados: {
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha,
            }
        })
    },

    async novoUsuario(_, { dados }, ctx) {
        ctx && ctx.validarAdmin()
        try{
            const idsPerfis = []

            //Atribuir o perfil 'comum' por default
            if(!dados.perfis || !dados.perfis.length) {
                dados.perfis = [{nome: 'comum'}]
            }

            /// console.log('dados.perfis...', dados.perfis) //////
            for(let filtro of dados.perfis) {
                const perfil = await obterPerfil(_, {filtro})
                if(perfil) idsPerfis.push(perfil.id)
                /// console.log('idsPerfis...', idsPerfis)/////////
            }

            // Criptografia da senha 
            const salt = bcrypt.genSaltSync()
            dados.senha = bcrypt.hashSync(dados.senha, salt)

            //Elimina perfis em dados, porque a coluna perfis não existe na tabela usuarios
            //Assimo posso inserir dados em usuarios
            delete dados.perfis
            
            //Inserir dados em usuarios

            const [id] = await db('usuarios').insert(dados).returning('id')
            //Inserir relações em usuarios_perfis
            for(let perfil_id of idsPerfis) {
                await db('usuarios_perfis').insert({perfil_id, usuario_id: id})
            }
            return db('usuarios').where({id}).first()
        }catch(e) {
            throw new Error(e) //e.sqlMessage
        }
    },

    async excluirUsuario(_, args, ctx) {
        ctx && ctx.validarAdmin()
        /*Nesta opção de eliminar o usuario, vamos primeiro eliminar
         as refs na tabela usuarios_perfis e depois eleminar o usuario 
         na tabela usuarios
        */
        try{
            const usuario = await obterUsuario(_, args)
            if(usuario) {
                const {id} = usuario
                await db('usuarios_perfis').where({usuario_id: id}).delete()
                await db('usuarios').where({id}).delete()
            }
            return usuario

        }catch(e) {
            throw new Error(e)
        }
    },

    async alterarUsuario(_, { filtro, dados }, ctx) {
        ctx && ctx.validarUsuarioFiltro(filtro)
        try{
            const usuario = await obterUsuario(_, {filtro})
            console.log('0-usuario..', usuario)
            if(usuario) {
                const {id} = usuario
                //Caso a alteração contenha perfis nos dados a alterar
                if(ctx.admin && dados.perfis) {
                    //Excluir todos os perfis do usuario na tabela usuario_perfis
                    await db('usuarios_perfis').where({usuario_id: id}).delete()
                    //Criar os novos perfis do usuario em usuarios_perfis
                    for(let filtro of dados.perfis) {
                        console.log('1----', {usuario_id: id})
                        const perfil = await obterPerfil(_, {filtro}) //Necessario para obter o id
                        
                        //perfil && ... - Só entra no await se perfil for TRUE
                        //perfil && await db('usuarios_perfis').insert({perfil_id: perfil.id, usuario_id: id})
                        if(perfil) {
                            await db('usuarios_perfis').insert({perfil_id: perfil.id, usuario_id: id})
                        }
                    }
                }
                
                if(dados.senha) {
                    //Criptografar senha
                    const salt = bcrypt.genSaltSync()
                    dados.senha = bcrypt.hashSync(dados.senha, salt)
                }

                //Eliminar a perfis em dados
                delete dados.perfis
                //Alterar o usuario na tabela usuarios
                await db('usuarios').where({id}).update(dados)
            }
            return !usuario ? null : ({...usuario, ...dados})

        }catch(e) {
            throw new Error(e)
        }
    }
}

module.exports = mutations