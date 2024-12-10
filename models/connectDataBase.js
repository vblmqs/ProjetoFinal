const mysql = require('mysql2');

// conexao
const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'root', 
  database: 'inventario'
});

// Função para testar a conexão com o banco de dados
const testarConexao = () => {
  return new Promise((resolve, reject) => {
    connection.connect((error) => {
      if (error) {
        reject('Erro na conexão com o banco de dados: ' + error.message);
      } else {
        resolve('Conexão bem-sucedida com o banco de dados!');
      }
    });
  });
};

// Função para realizar consultas ao banco de dados
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.execute(sql, params, (error, results) => {
      if (error) {
        reject('Erro ao executar a consulta: ' + error.message);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { testarConexao, query };

