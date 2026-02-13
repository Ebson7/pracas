const STORAGE_KEY = 'produtos_crud_simples';

let products = [];
let filteredProducts = [];

const productForm = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const nomeInput = document.getElementById('nome');
const categoriaInput = document.getElementById('categoria');
const precoInput = document.getElementById('preco');
const estoqueInput = document.getElementById('estoque');
const cancelEditButton = document.getElementById('cancelEdit');
const productsBody = document.getElementById('productsBody');
const searchInput = document.getElementById('searchInput');
const stats = document.getElementById('stats');
const formTitle = document.getElementById('formTitle');
const saveButton = document.getElementById('saveButton');

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    renderProducts();
    setupEventListeners();
});

function setupEventListeners() {
    productForm.addEventListener('submit', handleSubmit);
    cancelEditButton.addEventListener('click', resetForm);
    searchInput.addEventListener('input', handleSearch);
}

function handleSubmit(event) {
    event.preventDefault();

    const id = productIdInput.value;
    const productData = {
        nome: nomeInput.value.trim(),
        categoria: categoriaInput.value.trim(),
        preco: Number(precoInput.value),
        estoque: Number(estoqueInput.value)
    };

    if (!productData.nome || !productData.categoria) {
        return;
    }

    if (id) {
        updateProduct(Number(id), productData);
    } else {
        createProduct(productData);
    }

    saveProducts();
    resetForm();
    handleSearch();
}

function createProduct(productData) {
    const newProduct = {
        id: Date.now(),
        ...productData
    };
    products.push(newProduct);
}

function updateProduct(id, productData) {
    products = products.map((product) =>
        product.id === id ? { ...product, ...productData } : product
    );
}

function deleteProduct(id) {
    products = products.filter((product) => product.id !== id);
    saveProducts();
    handleSearch();
}

function editProduct(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    productIdInput.value = product.id;
    nomeInput.value = product.nome;
    categoriaInput.value = product.categoria;
    precoInput.value = product.preco;
    estoqueInput.value = product.estoque;

    formTitle.textContent = 'Editar Produto';
    saveButton.textContent = 'Atualizar';
    cancelEditButton.classList.remove('d-none');
}

function resetForm() {
    productForm.reset();
    productIdInput.value = '';
    formTitle.textContent = 'Cadastrar Produto';
    saveButton.textContent = 'Salvar';
    cancelEditButton.classList.add('d-none');
}

function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    filteredProducts = products.filter((product) => {
        return (
            product.nome.toLowerCase().includes(searchTerm) ||
            product.categoria.toLowerCase().includes(searchTerm)
        );
    });

    renderProducts();
}

function renderProducts() {
    const data = searchInput.value ? filteredProducts : products;

    productsBody.innerHTML = '';

    if (data.length === 0) {
        productsBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">Nenhum produto cadastrado.</td>
            </tr>
        `;
        stats.textContent = `Total de produtos: ${products.length}`;
        return;
    }

    data.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nome}</td>
            <td>${product.categoria}</td>
            <td>R$ ${product.preco.toFixed(2)}</td>
            <td>${product.estoque}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-warning me-1" data-action="edit" data-id="${product.id}">Editar</button>
                <button class="btn btn-sm btn-danger" data-action="delete" data-id="${product.id}">Excluir</button>
            </td>
        `;
        productsBody.appendChild(row);
    });

    stats.textContent = `Total de produtos: ${products.length}`;
}

productsBody.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.dataset.action;
    const id = Number(target.dataset.id);

    if (!action || !id) return;

    if (action === 'edit') {
        editProduct(id);
    }

    if (action === 'delete') {
        deleteProduct(id);
    }
});

function loadProducts() {
    const storedProducts = localStorage.getItem(STORAGE_KEY);
    products = storedProducts ? JSON.parse(storedProducts) : [];
    filteredProducts = [...products];
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
