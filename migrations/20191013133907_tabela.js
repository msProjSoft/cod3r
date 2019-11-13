exports.up = function(knex, Promise) {

  let createTable = `
      CREATE TABLE usuarios(
      id SERIAL PRIMARY KEY NOT NULL,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      activo BOOLEAN NOT NULL DEFAULT TRUE,
      data_criacao TIMESTAMP DEFAULT NOW()
      )
  `

  return knex.raw(createTable)

};

exports.down = function(knex, Promise) {
  let dropTable = `
      DROP TABLE usuarios
  `
  return knex.raw(dropTable)
};
