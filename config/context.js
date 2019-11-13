const jwt = require ('jwt-simple')

module.exports = async ({req}) => {
  //Em desenvolvimento
  //await require('./simularUsuarioLogado')(req)
  const auth = req.headers.authorization
  //console.log(auth)
  const token = auth && auth.substring(7) //Ignora 7 prieiros caracteres

  let usuario = null
  let admin = false

  if(token) {
    try{
      let conteudoToken = jwt.decode(token, process.env.APP_AUTH_SECRET)
      //Verificar se Token está valido, exp date
      if(new Date(conteudoToken.exp *1000) > new Date()) {
        usuario = conteudoToken
      }
    }catch(e) {
      //Token invalido
    }
  }

  //Se usuario logado, e com token valido...
  if(usuario && usuario.perfis) {
    admin = usuario.perfis.includes('admin') //Verfica se admin esta no array perfis
  }

  const err = new Error('Acesso negado!')

  return {
    usuario,
    admin,
    validarUsuario() {
      if(!usuario) throw err
    },
    validarAdmin() {
      if(!admin) throw err
    },
    validarUsuarioFiltro(filtro) {
      if(admin) return
      if(!usuario) throw err
      if(!filtro) throw err

      const {id, email} = filtro
      if(!id && !email) throw err
      if(id && id !== usuario.id) throw err
      if(email && email !== usuario.email) throw err

    }
  }



}

/*
  console.log('contexto')
  return {
    texto: 'Curso GraphQL !',
    imprimir() {
      console.log('Curso GraphQL !!!!!!')
    }
  }
*/