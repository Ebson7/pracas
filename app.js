
document.addEventListener('DOMContentLoaded', async function () {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'block';

    try {
        const response = await fetch('data.json');
        const allData = await response.json();

        if (loader) loader.style.display = 'none';

        let map = L.map('map').setView([-23.55, -46.63], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        let markersLayer = L.layerGroup().addTo(map);

        const input = document.getElementById('filtroRapido');
        input.addEventListener('input', () => {
            const termo = input.value.toLowerCase();
            const encontrado = allData.find(c => c.municipio.toLowerCase().includes(termo));
            if (encontrado && encontrado.lat && encontrado.lng) {
                markersLayer.clearLayers();
                const marker = L.marker([encontrado.lat, encontrado.lng])
                    .addTo(markersLayer)
                    .bindPopup(`<strong>${encontrado.municipio}</strong>`)
                    .openPopup();
                map.setView([encontrado.lat, encontrado.lng], 12);
            }
        });
    } catch (error) {
        if (loader) loader.innerText = 'Erro ao carregar os dados.';
        console.error('Erro ao carregar dados:', error);
    }
});
