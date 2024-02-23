# gb-teste-api

Este projeto é uma API backend desenvolvida com Fastify, projetada para fornecer uma série de endpoints para autenticação, gerenciamento de categorias, produtos, clientes, endereços e pedidos. Utiliza PostgreSQL como sistema de gerenciamento de banco de dados.

## Pré-requisitos

Para rodar este projeto, você precisa ter instalado:

- Node.js
- PostgreSQL

## Configuração Inicial

Siga estas etapas para configurar o ambiente de desenvolvimento:

1. **Clone o repositório** para sua máquina local.
2. **Navegue até a pasta `gb-teste-api`** onde o projeto foi clonado.
3. **Copie o arquivo `.env-example`** para um novo arquivo chamado `.env`.
4. **Atualize as variáveis de ambiente** no arquivo `.env` com as credenciais e configurações adequadas, incluindo a senha criptografada para autenticação:

    ```plaintext
    PORT=3000

    NODE_USER=nome_de_usuario_para_autenticacao
    NODE_PASSWORD=senha_plana_para_referencia
    NODE_PASSWORD_ENCRYPTED=hash_da_senha_para_autenticacao
    NODE_KEY=chave_secreta_para_jwt

    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_DB=nome_do_banco_de_dados
    POSTGRES_USER=usuario_do_banco_de_dados
    POSTGRES_PASSWORD=senha_do_banco_de_dados

    CORS_ORIGIN=http://localhost:3030,http://localhost:3000,http://localhost:XXXX
    ```

    Substitua `XXXX` e demais placeholders pelos valores apropriados para o seu ambiente.

5. **Instale as dependências** rodando `npm install` no terminal.

## Gerando Hash de Senha para Autenticação

Antes de iniciar a aplicação, você precisa gerar um hash de senha para usar na autenticação:

1. Execute o comando `npm run encrypt` no terminal, na raiz do projeto.
2. Digite a senha que deseja usar para `NODE_USER` quando solicitado. O script irá gerar um hash bcrypt que você deve copiar e colar como valor de `NODE_PASSWORD_ENCRYPTED` no seu arquivo `.env`.

## Executando o Projeto

-   Para iniciar a aplicação em modo de desenvolvimento, use:
    ```bash
    npm run dev
    ```
-   Para iniciar a aplicação em modo de produção, use:
    ```bash
    npm start
    ```

## Documentação da API com Swagger

A documentação da API está disponível via Swagger UI, facilitando o teste e a interação com os endpoints disponíveis. Para acessar a documentação:

1. Inicie a aplicação conforme descrito anteriormente.
2. Abra seu navegador e acesse `http://localhost:3000/documentation`.

Aqui você encontrará detalhes sobre todos os endpoints, incluindo os caminhos, parâmetros, e respostas esperadas.

## Endpoints Principais

A API inclui vários endpoints, como:

-   POST /login: Para autenticação de usuários.
-   GET /health: Para verificar o status da API.
-   GET /config/cep/{cep}: Para buscar informações de endereço pelo CEP.
-   GET /dashboard: Fornece informações agregadas para um dashboard.
-   CRUD /categoria: Para gerenciamento de categorias.
-   CRUD /produto: Para gerenciamento de produtos.
-   CRUD /cliente: Para gerenciamento de clientes.
-   CRUD /endereco: Para gerenciamento de endereços.
-   CRUD /pedido: Para gerenciamento de pedidos.

## Contribuindo

Sinta-se à vontade para contribuir com o projeto. Por favor, sinta-se à vontade para criar issues ou pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE.md na raiz para detalhes.
