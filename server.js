const express = require('express');
const { testarConexao, query } = require('./models/connectDataBase'); // Importando as funções de conexão e consulta
const app = express();
const port = 3000;
const cors = require('cors');

// Middleware para permitir requisições de outros domínios
app.use(cors());

// Middleware para interpretar o corpo das requisições como JSON
app.use(express.json());

// Testa a conexão com o banco de dados assim que o servidor for iniciado
(async () => {
  try {
    await testarConexao();
    console.log('Conexão bem-sucedida com o banco de dados!');
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error);
    process.exit(1); // Encerra o servidor caso a conexão falhe
  }
})();

// Rota para listar todos os produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await query('SELECT * FROM produtos'); // Consulta no banco
    console.log('Produtos retornados do banco:', produtos); // Log para verificar os dados
    res.json(produtos);
  } catch (error) {
    console.error('Erro na consulta ao banco de dados:', error); // Log de erro
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Rota para criar um novo produto
app.post('/produtos', async (req, res) => {
  const { descricao, valor, categoria } = req.body;

  if (!descricao || !valor || !categoria) {
    return res.status(400).json({ error: 'Descrição, valor e categoria são obrigatórios' });
  }

  try {
    await query('INSERT INTO produtos (descricao, valor, categoria) VALUES (?, ?, ?)', [descricao, valor, categoria]);
    console.log(`Produto criado com sucesso: ${descricao}, ${valor}, ${categoria}`); // Log para confirmação
    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar produto:', error); // Log de erro
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Rota para atualizar um produto existente
app.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, categoria } = req.body;

  if (!descricao || !valor || !categoria) {
    return res.status(400).json({ error: 'Descrição, valor e categoria são obrigatórios' });
  }

  try {
    await query('UPDATE produtos SET descricao = ?, valor = ?, categoria = ? WHERE id = ?', [descricao, valor, categoria, id]);
    console.log(`Produto atualizado com sucesso: ID ${id}, Descrição: ${descricao}`); // Log de sucesso
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error); // Log de erro
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Rota para deletar um produto
app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await query('DELETE FROM produtos WHERE id = ?', [id]);
    console.log(`Produto deletado com sucesso: ID ${id}`); // Log de sucesso
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error); // Log de erro
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});

