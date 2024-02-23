# gb-teste-app

Este projeto é a interface de usuário front-end para a aplicação gb-teste, construída com React. Ele interage com a API `gb-teste-api` para autenticação, gerenciamento de categorias, produtos, clientes, pedidos, entre outros. Utiliza Bootstrap e Material Icons para a estilização.

## Pré-requisitos

Para rodar este projeto, você precisa ter instalado:

- Node.js
- npm ou yarn

## Configuração Inicial

Siga estas etapas para configurar o ambiente de desenvolvimento:

1. **Clone o repositório** para sua máquina local.
2. **Navegue até a pasta `gb-teste-app`** onde o projeto foi clonado.
3. **Instale as dependências** rodando `npm install` ou `yarn install` no terminal.
4. **Configure as variáveis de ambiente**:
   - Copie o arquivo `.env-example` para um novo arquivo chamado `.env`.
   - Atualize a variável `REACT_APP_API_URL` com a URL da sua API `gb-teste-api`, substituindo `XXXX` pela porta correta em que sua API está rodando (ex: 3000).

## Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```
ou
```bash
yarn start
```

Isso iniciará o aplicativo no modo de desenvolvimento, abrindo uma aba no navegador padrão. A página irá recarregar se você fizer edições. Você também verá quaisquer erros no console.

## Estrutura de Rotas

O aplicativo utiliza react-router-dom para o gerenciamento de rotas. As rotas disponíveis são:

- /: Página de Login.
- /dashboard: Página principal do Dashboard (acesso restrito a usuários autenticados).
- /dashboard/categorias: Gerenciamento de Categorias (acesso restrito).
- /dashboard/produtos: Gerenciamento de Produtos (acesso restrito).
- /dashboard/clientes: Gerenciamento de Clientes (acesso restrito).
- /dashboard/pedidos: Gerenciamento de Pedidos (acesso restrito).
As rotas dentro do `<Route element={<PrivateRoute />}>` requerem autenticação. Usuários não autenticados serão redirecionados para a página de login.

## Scripts Disponíveis

No diretório do projeto, você pode rodar:

- start: Roda a aplicação em modo de desenvolvimento.
- build: Constrói a versão de produção da aplicação na pasta build.
- test: Inicia o executor de testes em modo de observação interativo.
- eject: Remove a dependência de build única do projeto.

## Contribuindo

Sinta-se à vontade para contribuir com o projeto. Por favor, sinta-se à vontade para criar issues ou pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE.md na raiz para detalhes.