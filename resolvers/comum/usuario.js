const jwt = require('jwt-simple')
const {perfis: obterPerfis} = require('../Type/Usuario')

module.exports = {
  async getUsuarioLogado(usuario) {
    // Obter os perfis para um usuario
    const perfis = await obterPerfis(usuario)
    //Necessario para a data de expiração do token
    const agora = Math.floor(Date.now()/1000) //Datas no jwt é em seg.
    
    const usuarioInfo = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfis: perfis.map(p => p.nome), //Array com os nomes dos perfis para este usuario
      iat: agora,
      exp: agora + (3*24*60*60), //Expira em 3 dias
    }

    const authSecret = process.env.APP_AUTH_SECRET
    
    //Devolve os dados do usuario e o token gerado com os seus dados
    return {
      ...usuarioInfo,
      token: jwt.encode(usuarioInfo, authSecret)
    }


  }
}