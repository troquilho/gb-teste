# gb-teste

Este repositório contém uma aplicação full-stack composta por uma API backend desenvolvida com Node.js e Fastify, e uma interface de usuário frontend desenvolvida com React.

## Configuração Inicial

Antes de iniciar a aplicação, é necessário configurar algumas variáveis de ambiente essenciais para a execução do banco de dados Postgres.

**Configurar Variáveis de Ambiente**:

-   Faça uma cópia do arquivo `.env-example` presente no repositório e renomeie a cópia para `.env`.
-   Altere os valores `XXXX` no arquivo `.env` pelas credenciais desejadas:
    ```
    POSTGRES_DB=nome_do_seu_banco
    POSTGRES_USER=seu_usuario
    POSTGRES_PASSWORD=sua_senha
    ```

## Preparando o Banco de Dados

Duas DDLs estão disponíveis na raiz do repositório para ajudar a configurar o banco de dados necessário para a aplicação:

1. **DDL de Criação**: Contém instruções SQL para criar as tabelas necessárias no banco de dados Postgres.
2. **DDL de Inserção**: Fornece uma série de comandos SQL para inserir dados iniciais no banco de dados, facilitando o teste inicial da aplicação.

Execute esses scripts no seu banco de dados Postgres para preparar o ambiente de dados da aplicação.

## Executando a Aplicação com Docker

A aplicação pode ser iniciada facilmente utilizando o Docker Compose, o qual irá orquestrar tanto o serviço do banco de dados quanto os serviços do backend e frontend.

### Pré-requisitos

-   Docker
-   Docker Compose

### Instruções

Para iniciar a aplicação, siga os passos abaixo:

1. **Iniciar os Serviços**:
    - No terminal, navegue até o diretório raiz do projeto.
    - Execute o comando `docker-compose up`. Isso irá construir e iniciar todos os serviços definidos no arquivo `docker-compose.yml`, incluindo o banco de dados Postgres e as aplicações Node e React.
2. **Acessar a Aplicação**:
    - Após os serviços estarem rodando, você pode acessar a aplicação frontend através do navegador no endereço `http://localhost:3030` (ajuste a porta conforme necessário).
    - A API backend estará disponível em `http://localhost:3000` (ou a porta que você configurou).

## Testando a Aplicação com Postman

Uma coleção Postman está incluída para facilitar o teste dos endpoints da API. Para utilizá-la:
1. Importe o arquivo JSON da coleção no Postman.
2. Configure as variáveis de ambiente no Postman conforme necessário, como a URL base da API.
3. Utilize os requests pré-configurados para testar as funcionalidades da API.

## Desenvolvimento

-   **Backend**: A API Node.js está localizada no diretório `/gb-teste-api`. Para mais detalhes sobre como contribuir para o desenvolvimento da API, veja o README específico na pasta.
-   **Frontend**: A interface de usuário React está localizada no diretório `/gb-teste-app`. Instruções adicionais para desenvolvimento podem ser encontradas no README da pasta.

## Contribuindo

Sinta-se à vontade para contribuir com o projeto.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE.md para detalhes.
