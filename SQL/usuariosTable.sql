SELECT * FROM usuarios

ALTER TABLE usuarios
DROP COLUMN senha

DELETE FROM usuarios WHERE id = 4

UPDATE usuarios_perfis
SET perfil_id = 2
WHERE usuario_id = 1

  SELECT *
  FROM 
    usuarios,
    usuarios_perfis,
    perfis
  WHERE 
    usuarios_perfis.usuario_id = usuarios.id AND
    usuarios_perfis.perfil_id = perfis.id AND
    usuarios.activo = TRUE AND
    perfis.nome = 'admin'
  LIMIT 1


