const db = require('../../config/db')
const bcrypt = require('bcrypt-nodejs')
const { getUsuarioLogado} = require('../comum/usuario')

module.exports = {

    async login(_, {dados}) {
        const usuario = await db('usuarios')
            .where({email: dados.email})
            .first()
        if(!usuario) {
            throw new Error('Usuario/Senha invalidos')
        }

        //Comparamos c/ bcrupt se a senha inserida (dados.senha) é igual à senha na bd (usuario.senha)
        const saoIguais = bcrypt.compareSync(dados.senha, usuario.senha)
        if(!saoIguais) {
            throw new Error ('Usuario/Senha invalidos')
        }
        
        //Caso coincida, então vamos obter o token, chamando getUsuarioLogado
        return getUsuarioLogado(usuario)
    },
/*
    usuarios(obj, args, ctx) {
        console.log(ctx.texto)
        ctx.imprimir() //Chama um metodo no contexto
        return db('usuarios')
    },
*/
    usuarios(parent, args, ctx) {
        ctx && ctx.validarAdmin()
        return db('usuarios')
    },

    usuario(_, { filtro }, ctx) {
        ctx && ctx.validarUsuarioFiltro(filtro)
        if(!filtro) return null
        const {id, email} = filtro //cria as comstante id, email apartir do obj filter
        if(id) {
            return db('usuarios').where({id}).first()
        }else if(email) {
            return db('usuarios').where({email}).first()
        }else {
            return null
        }   
    },
}