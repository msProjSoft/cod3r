exports.up = function(knex, Promise) {

  let createTable = `
  CREATE TABLE perfis(
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL UNIQUE,
    rotulo TEXT NOT NULL
  )
`
let insertData = `
  INSERT INTO perfis(nome, rotulo)
  VALUES
    ('comum','Comum'),
    ('admin','Administrador') 
`
return knex.raw(createTable)
  .then(function() {
    return knex.raw(insertData)
  })
};

exports.down = function(knex, Promise) {
  let dropTable = `
    DROP TABLE perfis
  `
  return knex.raw(dropTable)
};
