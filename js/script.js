// Armazena os produtos
let produtos = [];
let produtoEditando = null; 
const apiUrl = "http://localhost:3000/produtos"; 

// Exibe o formulário de cadastro
function showForm() {
    document.getElementById("product-form-container").style.display = "block";
    document.querySelector(".product-list").style.display = "none";
    clearErrorMessage();
}

// Retorna à lista de produtos
function showProductList() {
    document.getElementById("product-form-container").style.display = "none";
    document.querySelector(".product-list").style.display = "block";
    renderProductList(); // Garante que a lista seja renderizada ao mostrar
}

// Manipula a mudança na categoria
function handleCategoryChange() {
    const category = document.getElementById("product-category").value;
    const otherCategoryContainer = document.getElementById("other-category-container");
    otherCategoryContainer.style.display = category === "outros" ? "block" : "none";
}

// Formata valores para moeda brasileira
function formatarValor(valor) {
    const partes = valor.split(",");
    if (partes.length === 1) return `${valor},00`;
    if (partes[1].length === 1) return `${partes[0]},${partes[1]}0`;
    return valor;
}

// Limpa o formulário
function clearForm() {
    if (confirm("Tem certeza que deseja cancelar o cadastro?")) {
        document.getElementById("product-form").reset();
        document.getElementById("other-category-container").style.display = "none";
        clearErrorMessage();
        produtoEditando = null; // Limpa o produto sendo editado
        document.getElementById("product-description").disabled = false; // Reabilita o campo de descrição
        showProductList();
    }
}

// Remove mensagens de erro
function clearErrorMessage() {
    setTimeout(() => {
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "none";
        errorMessage.innerText = "";
    }, 3000); // Esconde a mensagem após 3 segundos
}

// Exibe mensagens de erro
function displayErrorMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
}

// Valida se a string contém apenas letras
function isAlphabetic(input) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚâêîôûÂÊÎÔÛãõÃÕçÇ\s]+$/.test(input);
}

// Valida e salva o produto
async function handleFormSubmit(event) {
    event.preventDefault();

    const descricao = document.getElementById("product-description").value.trim();
    const valor = document.getElementById("product-value").value.trim();
    const categoria = document.getElementById("product-category").value;
    const outraCategoria = document.getElementById("other-category")?.value.trim();

    // Validações
    if (!descricao) {
        displayErrorMessage("Descrição é obrigatória.");
        return;
    }
    if (descricao.length > 40) {
        displayErrorMessage("Descrição deve ter no máximo 40 caracteres.");
        return;
    }
    if (produtos.some(p => p.descricao === descricao && produtoEditando !== produtos.indexOf(p))) {
        displayErrorMessage("Já existe um produto com essa descrição.");
        return;
    }
    if (!valor.match(/^\d+(\,\d{1,2})?$/)) {
        displayErrorMessage("Valor inválido! Use o formato correto (ex: 100,00).");
        return;
    }
    if (!categoria) {
        displayErrorMessage("Selecione uma categoria.");
        return;
    }
    if (categoria === "outros") {
        if (!outraCategoria || outraCategoria.length > 30) {
            displayErrorMessage("Categoria personalizada inválida ou muito longa.");
            return;
        }
        if (!isAlphabetic(outraCategoria)) {
            displayErrorMessage("A categoria personalizada só pode conter letras.");
            return;
        }
    }

    // Cria o objeto produto
    const produto = {
        descricao: descricao,
        valor: formatarValor(valor),
        categoria: categoria === "outros" ? outraCategoria : categoria
    };

    try {
        // Confirmação antes de salvar
        if (confirm("Deseja salvar o produto?")) {
            let response;
            if (produtoEditando !== null) {
                response = await fetch(`${apiUrl}/${produtos[produtoEditando].id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(produto)
                });
            } else {
                response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(produto)
                });
            }

            // Log da resposta da API para diagnóstico
            console.log("Resposta da API:", response);

            if (response.ok) {
                const data = await response.json();
                if (produtoEditando !== null) {
                    produtos[produtoEditando] = data;
                } else {
                    produtos.push(data);
                }

                document.getElementById("product-form").reset();
                document.getElementById("product-description").disabled = false;
                produtoEditando = null;
                showProductList();
            } else {
                const error = await response.json();
                displayErrorMessage(error.message || "Erro ao salvar o produto.");
            }
        }
    } catch (error) {
        displayErrorMessage("Erro ao se conectar com a API.");
        console.error(error);
    }
}

// Renderiza a lista de produtos
function renderProductList() {
    const lista = document.getElementById("product-list");
    lista.innerHTML = "";
    produtos.forEach((produto, index) => {
        lista.appendChild(createProductCard(produto, index));
    });
}

function createProductCard(produto, index) {
    const produtoDiv = document.createElement("div");
    produtoDiv.classList.add("product-card");
    produtoDiv.innerHTML = `
        <h3>${produto.descricao}</h3>
        <p>Valor: R$ ${produto.valor}</p>
        <p>Categoria: ${produto.categoria}</p>
        <div class="actions">
            <button class="edit-btn" onclick="editProduct(${index})">✏️</button>
            <button class="delete-btn" onclick="deleteProduct(${index})">🗑️</button>
        </div>
    `;
    return produtoDiv;
}

// Edita um produto
function editProduct(index) {
    produtoEditando = index;
    const produto = produtos[index];
    document.getElementById("product-description").value = produto.descricao;
    document.getElementById("product-description").disabled = true;
    document.getElementById("product-value").value = produto.valor;
    document.getElementById("product-category").value = produto.categoria;
    if (produto.categoria === "outros") {
        document.getElementById("other-category").value = produto.categoria;
        document.getElementById("other-category-container").style.display = "block";
    }
    showForm();
}

// Deleta um produto
async function deleteProduct(index) {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
        try {
            const produto = produtos[index];
            const response = await fetch(`${apiUrl}/${produto.id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                produtos.splice(index, 1);
                renderProductList();
            } else {
                const error = await response.json();
                displayErrorMessage(error.message || "Erro ao deletar o produto.");
            }
        } catch (error) {
            displayErrorMessage("Erro ao se conectar com a API.");
            console.error(error);
        }
    }
}


