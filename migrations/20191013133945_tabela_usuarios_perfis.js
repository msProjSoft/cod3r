exports.up = function(knex, Promise) {

  let createTable = `
      CREATE TABLE usuarios_perfis(
          usuario_id INT NOT NULL,
          perfil_id INT NOT NULL,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
          FOREIGN KEY (perfil_id) REFERENCES perfis (id),
          PRIMARY KEY(usuario_id, perfil_id)
      )
  `

  return knex.raw(createTable)

};

exports.down = function(knex, Promise) {
  let dropTable = `
      DROP TABLE usuarios_perfis
  `
  return knex.raw(dropTable)
};
