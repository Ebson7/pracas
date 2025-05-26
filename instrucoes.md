# Manual de Instruções - Aplicação de Consulta de Praças e Municípios

## Visão Geral

Esta aplicação web permite filtrar e consultar informações da planilha "Consolidado_Pracas_Municipios.xlsx" através de uma interface amigável e responsiva desenvolvida com Bootstrap. A aplicação oferece filtros simples e avançados, ordenação, paginação e exportação de dados.

## Funcionalidades Principais

### 1. Filtro Rápido
- Localizado na parte superior da página
- Permite buscar em todas as colunas simultaneamente
- Digite qualquer termo para filtrar instantaneamente os resultados

### 2. Filtros Avançados
- Permite filtrar por colunas específicas:
  - Região
  - Praça
  - Cidade
  - Filial
  - Data Carregamento
- Selecione os valores desejados e clique em "Aplicar"
- Para limpar os filtros, clique em "Limpar"
- O botão com ícone de seta no cabeçalho permite expandir/recolher os filtros avançados

### 3. Ordenação
- Clique no botão "Ordenar" para abrir as opções
- Selecione a coluna desejada e depois escolha a ordem (crescente ou decrescente)
- A ordenação atual é exibida no botão

### 4. Paginação
- Navegue entre as páginas usando os controles na parte inferior
- Altere o número de registros por página através do seletor "por página"

### 5. Exportação
- Clique em "Exportar CSV" para baixar os dados filtrados em formato CSV
- O arquivo exportado contém apenas os registros que estão atualmente filtrados

## Dicas de Uso

1. **Combinação de Filtros**: Você pode combinar o filtro rápido com os filtros avançados para refinar ainda mais sua busca.

2. **Visualização de Dados**: A tabela mostra automaticamente o número total de registros e quantos estão sendo exibidos após a aplicação dos filtros.

3. **Responsividade**: A aplicação funciona em dispositivos móveis e desktops, adaptando-se automaticamente ao tamanho da tela.

4. **Performance**: Para melhor desempenho em grandes conjuntos de dados, utilize os filtros avançados para reduzir o número de registros antes de aplicar ordenações complexas.

## Requisitos Técnicos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet para carregar as bibliotecas Bootstrap e Font Awesome
- JavaScript habilitado no navegador

## Arquivos da Aplicação

- **index.html**: Estrutura da página e interface do usuário
- **app.js**: Lógica de funcionamento, filtros e manipulação de dados
- **data.json**: Dados convertidos da planilha original

Para qualquer dúvida adicional ou suporte, entre em contato.
