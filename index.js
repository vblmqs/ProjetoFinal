const express = require("express");
const db = require("./models/connectDataBase");
const rotas = require("./routes");
const app = express();
const porta = 3000;

db.testarConexao().catch((err) => {
  console.error(
    "Não foi possível conectar ao banco de dados. Encerrando o aplicativo."
  );
  process.exit(1);
});

app.use(express.json());

app.use(rotas);

app.listen(porta, () => {
  console.log(`Servidor rodando em: http://localhost:${porta}`);
});