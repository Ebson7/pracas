# Manual de Instruções - CRUD Simples de Produtos

## Visão Geral

Esta aplicação web permite **cadastrar, listar, editar e excluir produtos** em uma interface simples com Bootstrap. Os dados ficam salvos no navegador usando **localStorage**.

## Funcionalidades Principais

### 1. Cadastro de Produto
- Preencha os campos:
  - Nome
  - Categoria
  - Preço
  - Estoque
- Clique em **Salvar** para adicionar o produto.

### 2. Listagem de Produtos
- Os produtos cadastrados aparecem na tabela.
- A coluna de ações contém os botões **Editar** e **Excluir**.

### 3. Edição de Produto
- Clique em **Editar** no item desejado.
- O formulário será preenchido com os dados do produto.
- Clique em **Atualizar** para confirmar a alteração.
- Use **Cancelar edição** para voltar ao modo de cadastro.

### 4. Exclusão de Produto
- Clique em **Excluir** para remover o produto da lista.

### 5. Busca
- O campo de busca filtra os produtos por **nome** ou **categoria** em tempo real.

### 6. Persistência de Dados
- Os produtos são armazenados no `localStorage` do navegador.
- Ao recarregar a página, os dados permanecem disponíveis no mesmo navegador.

## Arquivos da Aplicação

- **index.html**: estrutura da interface do CRUD.
- **app.js**: lógica de cadastro, edição, exclusão, busca e persistência.

## Requisitos Técnicos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Internet para carregar o Bootstrap via CDN
