
document.addEventListener('DOMContentLoaded', async function () {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'block';

    const STORAGE_KEY = 'dadosCidadesSP';
    const STORAGE_DATE_KEY = 'dadosCidadesSP_data';
    const hoje = new Date().toISOString().split('T')[0];

    let allData = [];

    try {
        const cacheData = localStorage.getItem(STORAGE_KEY);
        const cacheDate = localStorage.getItem(STORAGE_DATE_KEY);

        if (cacheData && cacheDate === hoje) {
            allData = JSON.parse(cacheData);
            console.log('✔️ Dados carregados do cache local');
        } else {
            const response = await fetch('data.json');
            allData = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
            localStorage.setItem(STORAGE_DATE_KEY, hoje);
            console.log('⬇️ Dados baixados e salvos no cache');
        }

        if (loader) loader.style.display = 'none';

        let map = L.map('map').setView([-23.55, -46.63], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        let markersLayer = L.layerGroup().addTo(map);

        // Removido filtro rápido do mapa para simplificar a interface

        // Filtros adicionais podem ser implementados aqui no futuro

    } catch (error) {
        if (loader) loader.innerText = 'Erro ao carregar os dados.';
        console.error('Erro ao carregar dados:', error);
    }
});
