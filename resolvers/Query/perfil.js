const db = require('../../config/db')

module.exports = {
    perfis(aprent, args, ctx) {
        ctx && ctx.validarAdmin()
        return db('perfis')
    },
    
    perfil(_, { filtro }, ctx) {
        ctx && ctx.validarAdmin()
        if(!filtro) return null
        const {id, nome} = filtro
        if(id) {
            return db('perfis').where({id}).first()
        }else if(nome) {
            return db('perfis').where({nome}).first() //Nome é UNIQUE
        }else {
            return null
        }
    }
}