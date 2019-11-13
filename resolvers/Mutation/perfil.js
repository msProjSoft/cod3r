const db = require('../../config/db')

const {perfil: obterPerfil} = require('../Query/perfil')

module.exports = {
    async novoPerfil(_, { dados }, ctx) {
        ctx && ctx.validarAdmin() // Se ctx dif nullo passa para validarAdmin
        try{
           const [id] = await db('perfis').insert(dados).returning('id') 
           return db('perfis').where({id}).first()
        }catch(e) {
            throw new Error(e.sqlMessage)
        }
    },
    
    async excluirPerfil(_, args, ctx) {
        ctx && ctx.validarAdmin()
        /*Nesta opção de eliminar o perfil, vamos primeiro eliminar
         as refs na tabela usuarios_perfis e depois eleminar o perfil 
         na tabela perfis
        */
        try{
            const perfil = await obterPerfil(_, args)
            if(perfil) {
                const {id} = perfil
                await db('usuarios_perfis').where({perfil_id: id}).delete()
                await db('perfis').where({id}).delete()
            }
            return perfil
        }catch(e) {
            throw new Error(e.sqlMessage)
        }
    },

    async alterarPerfil(_, { filtro, dados }, ctx) {
        ctx && ctx.validarAdmin()
        try{
            const perfil = await obterPerfil(_, {filtro})
            if(perfil) {
                const {id} = perfil
                await db('perfis').where({id}).update(dados)
            }
            return ({...perfil, ...dados}) //Junta os 2 objectos, e prevelace o mais recente
        }catch(e) {
            throw new Error(e.sqlMessage)
        }

    }
}