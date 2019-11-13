const db = require('../../config/db')

module.exports = {
    perfis(usuario) {
        return db('perfis') //Tabela a consultar
            .join(
                'usuarios_perfis', //Tabela junção (Junta 2 tabelas)
                'perfis.id', //Tabela a consultar - Coluna da junção com...
                'usuarios_perfis.perfil_id' //Tabela junção - Coluna da junção com...
            )
            .where({usuario_id: usuario.id}) //Condição a filtrar por id
    }
}