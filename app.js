// Variáveis globais
let allData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 10;
let currentSortColumn = '';
let currentSortOrder = 'asc';
let map;
let markersLayer;
let uniqueValues = {};

// Carregar dados do arquivo JSON

document.addEventListener('DOMContentLoaded', async function() {
    const loader = document.getElementById('loader');
    const searchCidade = document.getElementById('searchCidade');

    if (searchCidade) {
        searchCidade.addEventListener('input', () => {
            const termo = searchCidade.value.toLowerCase();
            filteredData = termo ? allData.filter(d => d.municipio.toLowerCase().includes(termo)) : [...allData];
            updateTable();
            updateStats();
            centralizarNoMapa(filteredData);
        });
    }

    map = L.map('map').setView([-23.55, -46.63], 10);
    markersLayer = L.layerGroup().addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const addMapMarkers = (data) => {
        data.forEach(item => {
            if (item.lat && item.lng) {
                L.marker([item.lat, item.lng]).addTo(map).bindPopup(item.nome || "Praça");
            }
        });
    };

    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar os dados');
        }
        
        allData = await response.json();
        filteredData = [...allData];
        
        // Inicializar os filtros avançados
        initializeFilters();
        
        addMapMarkers(filteredData);
        loader.style.display = 'none';
        // Renderizar a tabela inicial
        updateTable();
        
        // Configurar eventos
        setupEventListeners();
        
        // Atualizar estatísticas
        updateStats();
            centralizarNoMapa(filteredData);
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('resultStats').innerHTML = 
            `<i class="fas fa-exclamation-circle me-2"></i>Erro ao carregar dados: ${error.message}`;
    }
});

// Inicializar filtros avançados com valores únicos das colunas
function initializeFilters() {
    const columns = ['Região', 'Praca', 'Cidade', 'Filial', 'Data Carregamento'];
    
    columns.forEach(column => {
        // Obter valores únicos para cada coluna
        const values = [...new Set(allData.map(item => item[column]))].sort();
        uniqueValues[column] = values;
        
        // Preencher os selects com as opções
        const selectId = column === 'Praca' ? 'praca' : 
                        column === 'Data Carregamento' ? 'dataCarregamento' : 
                        column.toLowerCase();
        
        const select = document.getElementById(selectId);
        if (select) {
            values.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }
    });
}

// Configurar todos os event listeners
function setupEventListeners() {
    // Filtro rápido
    document.getElementById('quickFilter').addEventListener('input', handleQuickFilter);
    document.getElementById('clearQuickFilter').addEventListener('click', clearQuickFilter);
    
    // Filtros avançados
    document.getElementById('applyFilters').addEventListener('click', applyAdvancedFilters);
    document.getElementById('clearFilters').addEventListener('click', clearAdvancedFilters);
    document.getElementById('toggleFilters').addEventListener('click', toggleAdvancedFilters);
    
    // Ordenação
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            currentSortColumn = this.dataset.column;
            updateSortUI();
        });
    });
    
    document.getElementById('sortAsc').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentSortColumn) {
            currentSortOrder = 'asc';
            sortData();
        }
    });
    
    document.getElementById('sortDesc').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentSortColumn) {
            currentSortOrder = 'desc';
            sortData();
        }
    });
    
    // Paginação
    document.getElementById('rowsPerPage').addEventListener('change', function() {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        updateTable();
    });
    
    // Exportar CSV
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
}

// Filtro rápido em todas as colunas
function handleQuickFilter() {
    const searchTerm = document.getElementById('quickFilter').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredData = [...allData];
    } else {
        filteredData = allData.filter(item => {
            return Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            );
        });
    }
    
    currentPage = 1;
    updateTable();
    updateStats();
            centralizarNoMapa(filteredData);
}

// Limpar filtro rápido
function clearQuickFilter() {
    document.getElementById('quickFilter').value = '';
    handleQuickFilter();
}

// Aplicar filtros avançados
function applyAdvancedFilters() {
    const filters = {
        'Região': document.getElementById('regiao').value,
        'Praca': document.getElementById('praca').value,
        'Cidade': document.getElementById('cidade').value,
        'Filial': document.getElementById('filial').value,
        'Data Carregamento': document.getElementById('dataCarregamento').value
    };
    
    filteredData = allData.filter(item => {
        return Object.entries(filters).every(([column, value]) => {
            return value === '' || item[column] === value;
        });
    });
    
    currentPage = 1;
    updateTable();
    updateStats();
            centralizarNoMapa(filteredData);
}

// Limpar filtros avançados
function clearAdvancedFilters() {
    document.getElementById('regiao').value = '';
    document.getElementById('praca').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('filial').value = '';
    document.getElementById('dataCarregamento').value = '';
    
    filteredData = [...allData];
    currentPage = 1;
    updateTable();
    updateStats();
            centralizarNoMapa(filteredData);
}

// Alternar visibilidade dos filtros avançados
function toggleAdvancedFilters() {
    const filtersDiv = document.getElementById('advancedFilters');
    const toggleBtn = document.getElementById('toggleFilters');
    
    if (filtersDiv.style.display === 'none') {
        filtersDiv.style.display = 'block';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        filtersDiv.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

// Ordenar dados
function sortData() {
    if (!currentSortColumn) return;
    
    filteredData.sort((a, b) => {
        const valueA = a[currentSortColumn];
        const valueB = b[currentSortColumn];
        
        if (valueA < valueB) {
            return currentSortOrder === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return currentSortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    updateTable();
    updateSortUI();
}

// Atualizar indicadores visuais de ordenação
function updateSortUI() {
    if (currentSortColumn) {
        const sortText = `${currentSortColumn} (${currentSortOrder === 'asc' ? 'Crescente' : 'Decrescente'})`;
        document.querySelector('.btn-group .btn').innerHTML = 
            `<i class="fas fa-sort me-1"></i>Ordenado por: ${sortText}`;
    }
    sortData();
}

// Atualizar tabela com dados filtrados e paginados
function updateTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">Nenhum resultado encontrado</td>';
        tableBody.appendChild(row);
        
        // Limpar paginação
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    // Calcular índices para paginação
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Renderizar linhas da tabela
    pageData.forEach(item => {
        const row = document.createElement('tr');
        
        // Adicionar células para cada coluna
        row.innerHTML = `
            <td>${item['Região']}</td>
            <td>${item['Praca']}</td>
            <td>${item['Cidade']}</td>
            <td>${item['Filial']}</td>
            <td>${item['Data Carregamento']}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Atualizar paginação
    updatePagination();
}

// Atualizar controles de paginação
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
    
    // Botão anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Anterior">
                          <span aria-hidden="true">&laquo;</span>
                        </a>`;
    if (currentPage > 1) {
        prevLi.addEventListener('click', () => {
            currentPage--;
            updateTable();
        });
    }
    paginationElement.appendChild(prevLi);
    
    // Páginas numeradas
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        if (i !== currentPage) {
            pageLi.addEventListener('click', () => {
                currentPage = i;
                updateTable();
            });
        }
        
        paginationElement.appendChild(pageLi);
    }
    
    // Botão próximo
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Próximo">
                          <span aria-hidden="true">&raquo;</span>
                        </a>`;
    if (currentPage < totalPages) {
        nextLi.addEventListener('click', () => {
            currentPage++;
            updateTable();
        });
    }
    paginationElement.appendChild(nextLi);
}

// Atualizar estatísticas de resultados
function updateStats() {
    const statsElement = document.getElementById('resultStats');
    statsElement.innerHTML = `
        <i class="fas fa-info-circle me-2"></i>
        Exibindo ${filteredData.length} de ${allData.length} registros
    `;
}

// Exportar dados filtrados para CSV
function exportToCSV() {
    if (filteredData.length === 0) {
        alert('Não há dados para exportar');
        return;
    }
    
    // Cabeçalhos
    const headers = Object.keys(filteredData[0]);
    
    // Converter dados para formato CSV
    let csvContent = headers.join(',') + '\n';
    
    filteredData.forEach(item => {
        const row = headers.map(header => {
            // Escapar aspas e adicionar aspas ao redor de cada valor
            const value = item[header] === null ? '' : String(item[header]);
            return `"${value.replace(/"/g, '""')}"`;
        });
        csvContent += row.join(',') + '\n';
    });
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'dados_filtrados.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function centralizarNoMapa(dados) {
    if (!map || !markersLayer) return;
    markersLayer.clearLayers();
    dados.forEach(item => {
        if (item.lat && item.lng) {
            const marker = L.marker([item.lat, item.lng])
                .bindPopup(`<strong>${item.nome}</strong><br>${item.municipio}`)
                .addTo(markersLayer);
        }
    });

    if (dados.length > 0 && dados[0].lat && dados[0].lng) {
        map.setView([dados[0].lat, dados[0].lng], 13);
    }
}
