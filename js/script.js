let products = [];
let currentProductId = 1;

function handleFormSubmit(event) {
  event.preventDefault();

  const description = document.getElementById("product-description").value;
  const value = document.getElementById("product-value").value;
  const category = document.getElementById("product-category").value;
  const otherCategory = document.getElementById("other-category").value;

  // Limpeza de erros
  hideError();

  // Validação de campos
  if (!description || !value || !category) {
    showError("Todos os campos são obrigatórios.");
    return;
  }

  // Validação da descrição (somente texto e até 40 caracteres)
  if (!/^[a-zA-Z\s]+$/.test(description)) {
    showError("A descrição deve conter apenas letras e espaços.");
    return;
  }

  if (description.length > 40) {
    showError("A descrição não pode ter mais de 40 caracteres.");
    return;
  }

  // Validação do valor (somente números e formato de moeda)
  if (!/^\d+(\,\d{2})?$/.test(value)) {
    showError("O valor deve ser um número válido com até 2 casas decimais.");
    return;
  }

  // Verificar se o valor está no formato correto de moeda (com vírgula como separador)
  const formattedValue = formatCurrency(value);

  if (category === "outros" && !otherCategory) {
    showError("Por favor, informe a categoria.");
    return;
  }

  // Verificar se já existe um produto com a mesma descrição
  const productExists = products.some(product => product.description === description);
  if (productExists) {
    showError("Já existe um produto com essa descrição.");
    return;
  }

  // Criando o produto
  const product = {
    id: currentProductId++,
    description,
    value: formattedValue,
    category: category === "outros" ? otherCategory : category,
  };

  products.push(product);
  renderProductList();
  clearForm();
}

function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function hideError() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "none";
}

function renderProductList() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <h3>${product.description}</h3>
      <p><strong>Valor:</strong> ${product.value}</p>
      <p><strong>Categoria:</strong> ${product.category}</p>
      <div class="actions">
        <button class="edit-btn" onclick="editProduct(${product.id})">✎</button>
        <button class="delete-btn" onclick="deleteProduct(${product.id})">🗑</button>
      </div>
    `;

    productList.appendChild(productCard);
  });
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-value").value = product.value.replace("R$ ", "").replace(".", ",");
    document.getElementById("product-category").value = product.category === "outros" ? "outros" : product.category;
    document.getElementById("other-category").value = product.category === "outros" ? product.category : "";
    showForm();
  }
}

function deleteProduct(id) {
  products = products.filter(product => product.id !== id);
  renderProductList();
}

function handleCategoryChange() {
  const categorySelect = document.getElementById("product-category");
  const otherCategoryContainer = document.getElementById("other-category-container");
  
  if (categorySelect.value === "outros") {
    otherCategoryContainer.style.display = "block";
  } else {
    otherCategoryContainer.style.display = "none";
  }
}

function clearForm() {
  document.getElementById("product-description").value = "";
  document.getElementById("product-value").value = "";
  document.getElementById("product-category").value = "";
  document.getElementById("other-category").value = "";
}

function showForm() {
  document.getElementById("product-form-container").style.display = "block";
  document.querySelector(".product-list").style.display = "none";
}

function hideForm() {
  document.getElementById("product-form-container").style.display = "none";
  document.querySelector(".product-list").style.display = "block";
}

function formatCurrency(value) {
  return "R$ " + value.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2").replace(/(\d)(\d{3})(\d{3})$/, "$1.$2.$3");
}

function showProductList() {
  document.getElementById("product-form-container").style.display = "none";
  document.querySelector(".product-list").style.display = "block";
}

