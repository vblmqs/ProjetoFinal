const mysql = require("mysql2/promise");

const client = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "inventario",
});

const testarConexao = async () => {
  try {
    const connection = await client.getConnection();
    console.log("MySQL conectado com sucesso!");
    connection.release();
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw error;
  }
};

exports.query = async (consulta, valores) => {
  try {
    const [linhas, campos] = await client.execute(consulta, valores);
    return linhas;
  } catch (error) {
    console.error("Erro na consulta ao banco de dados:", error);
    throw error;
  }
};

// Exportar a função testarConexao
exports.testarConexao = testarConexao;