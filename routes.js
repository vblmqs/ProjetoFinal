const { Router } = require("express");
const db = require("./models/connectDataBase");

const rotas = Router();

// Listagem de Produtos
rotas.get("/produtos", async (request, response) => {
  try {
    const [produtos] = await db.query("SELECT * FROM produtos");
    response.json(produtos);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar produtos", details: error.message });
  }
});

// Criação de Produto
rotas.post("/produtos", async (request, response) => {
  const { descricao, valor, categoria } = request.body;

  // Validação simples
  if (!descricao || descricao.length > 50) {
    return response.status(400).json({ error: "Descrição deve ter no máximo 50 caracteres" });
  }

  if (!valor || isNaN(valor) || valor < 0) {
    return response.status(400).json({ error: "Valor inválido" });
  }

  if (!categoria || categoria.length > 30) {
    return response.status(400).json({ error: "Categoria deve ter no máximo 30 caracteres" });
  }

  try {
    const resultado = await db.query(
      "INSERT INTO produtos (descricao, valor, categoria) VALUES (?, ?, ?)",
      [descricao, valor, categoria]
    );
    response.status(201).json({ message: "Produto criado com sucesso", id: resultado.insertId });
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar produto", details: error.message });
  }
});

// Atualização/Alteração de Produto
rotas.put("/produtos/:id", async (request, response) => {
  const { id } = request.params;
  const { descricao, valor, categoria } = request.body;

  // Validação simples
  if (!descricao || descricao.length > 50) {
    return response.status(400).json({ error: "Descrição deve ter no máximo 50 caracteres" });
  }

  if (!valor || isNaN(valor) || valor < 0) {
    return response.status(400).json({ error: "Valor inválido" });
  }

  if (!categoria || categoria.length > 30) {
    return response.status(400).json({ error: "Categoria deve ter no máximo 30 caracteres" });
  }

  try {
    const [produtoExistente] = await db.query("SELECT * FROM produtos WHERE id = ?", [id]);
    if (!produtoExistente) {
      return response.status(404).json({ error: "Produto não encontrado" });
    }

    await db.query(
      "UPDATE produtos SET descricao = ?, valor = ?, categoria = ? WHERE id = ?",
      [descricao, valor, categoria, id]
    );
    response.json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar produto", details: error.message });
  }
});

// Deletar Produto
rotas.delete("/produtos/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const [produtoExistente] = await db.query("SELECT * FROM produtos WHERE id = ?", [id]);
    if (!produtoExistente) {
      return response.status(404).json({ error: "Produto não encontrado" });
    }

    await db.query("DELETE FROM produtos WHERE id = ?", [id]);
    response.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar produto", details: error.message });
  }
});

module.exports = rotas;

