// Armazena os produtos
let produtos = [];
let produtoEditando = null; // Variável para armazenar o índice do produto sendo editado

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
    let partes = valor.split(",");
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
    document.getElementById("error-message").style.display = "none";
    document.getElementById("error-message").innerText = "";
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
function handleFormSubmit(event) {
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
    
    // Verifica se existe outro produto com a mesma descrição, mas ignora o produto em edição
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

    // Confirmação antes de salvar
    if (confirm("Deseja salvar o produto?")) {
        const produto = {
            descricao: produtos[produtoEditando]?.descricao || descricao, // Não permite mudar a descrição
            valor: formatarValor(valor),
            categoria: categoria === "outros" ? outraCategoria : categoria
        };

        if (produtoEditando !== null) {
            // Atualiza o produto existente (não permite alterar a descrição)
            produtos[produtoEditando] = produto;
            produtoEditando = null; // Limpa a referência de edição
        } else {
            // Adiciona novo produto
            produtos.push(produto);
        }

        document.getElementById("product-form").reset();
        document.getElementById("product-description").disabled = false; // Reabilita o campo de descrição
        showProductList();
    }
}

// Renderiza a lista de produtos
function renderProductList() {
    const lista = document.getElementById("product-list");
    lista.innerHTML = "";
    produtos.forEach((produto, index) => {
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
        lista.appendChild(produtoDiv);
    });
}

// Edita um produto
function editProduct(index) {
    produtoEditando = index;  // Atribui o índice do produto a ser editado
    const produto = produtos[index];
    document.getElementById("product-description").value = produto.descricao; // Descrição não pode ser alterada
    document.getElementById("product-description").disabled = true; // Desabilita o campo de descrição
    document.getElementById("product-value").value = produto.valor;
    document.getElementById("product-category").value = produto.categoria;
    if (produto.categoria === "outros") {
        document.getElementById("other-category").value = produto.categoria;
        document.getElementById("other-category-container").style.display = "block";
    }
    showForm();
}

// Deleta um produto
function deleteProduct(index) {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
        produtos.splice(index, 1);
        renderProductList();
    }
}
