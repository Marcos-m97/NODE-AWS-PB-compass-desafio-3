# CRUD de Carros - Compass Car API

Este projeto é uma API para locação de carros, permitindo criar, ler, atualizar e excluir informações sobre carros.

## Tecnologias

- **Node.js**: Execução de JavaScript no servidor
- **Express**: Framework para APIs
- **MySQL**: Banco de dados
- **TypeScript**: Tipagem estática
- **Swagger**: Documentação da API

## Endpoints

- **POST /cars**: Criar um novo carro
- **GET /cars**: Listar todos os carros
- **GET /cars/{id}**: Obter carro pelo ID
- **PUT /cars/{id}**: Atualizar carro pelo ID
- **DELETE /cars/{id}**: Deletar carro pelo ID

## Execução Local

Clone o repositório:

 git clone https://github.com/Marcos-m97/AWS_NODE_AGO24_DESAFIO_02_ARLEQUINA

 cd AWS_NODE_AGO24_DESAFIO_02_ARLEQUINA

## Instalando as Dependências

Instale as dependências do projeto:

 npm install ou yarn install

# Configuração

Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto e adicione as variáveis de ambiente necessárias:

env

### Banco de Dados MySQL

DB_HOST=yourhost
DB_USER=your_db_user
DB_PASSWORD=yourpassword
DB_NAME=your_db_name
DB_PORT=3306

### configuração do servidor

PORT=3000
DB_HOST=127.0.0.1
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco_de_dados
```
Inicie o servidor:
```sh
npm run dev
```
## Documentação da API

### configuração da seed

DEFAULT_NAME=your_admin_UserName
DEFAULT_EMAIL=your_default_Email
DEFAULT_PASSWORD=your_default_password

### configração do JWT

JWT_SECRET=your_JWT_secret

rodar o MySQL localmente, ou usando o Docker. Se estiver usando o Docker, você pode criar um container MySQL com o seguinte comando:

docker run --name compass-car-db -e MYSQL_ROOT_PASSWORD=sua_senha -e MYSQL_DATABASE=compass_car_db -p 3306:3306 -d mysql:8.0

Atençao, garanta que as no .env sejam iguais à configuração do seu ambiente.

# Sincronizando o Banco de Dados

Após configurar as variáveis de ambiente e o banco de dados, você pode sincronizar as tabelas usando o Sequelize:

### npm run db:sync

Isso criará as tabelas definidas nos models.

# Execução

Após configurar o projeto, você pode rodar o servidor localmente com o seguinte comando:

### npm run dev

O servidor estará rodando em http://localhost:3000.

# Documentação da API

A documentação da API foi gerada usando Swagger. Você pode acessar a documentação completa e testar os endpoints diretamente na interface do Swagger.
garanta que o servidor esteja rodando na porta 3000 e acesse http://localhost:3000 em seu navegador para acessar a documentação.

## Endpoints Principais

Autenticação: /api/v1/login
Usuários: /api/v1/users  
Clientes: /api/v1/clients  
Carros: /api/v1/cars  
Pedidos de Locação: /api/v1/rentals

# Estrutura de pastas de Projeto

Aqui está um exemplo da estrutura do projeto:

src/
|-- controllers/ # Controladores de rotas
|-- definition/ # Tipos e interfaces do TypeScript
|-- models/ # Modelos do Sequelize (tabelas do banco de dados)
|-- repositories/ # Repositórios para acesso ao banco de dados
|-- routes/ # Definição das rotas da API
|-- services/ # Lógica de negócios
|-- middlewares/ # Middlewares (autenticação, erros, etc)
|-- db.ts # Configuração da conexão com o banco de dados
|-- app.ts # Configuração principal do Express
|-- index.ts # Arquivo de entrada principal do servidor

# Tecnologias Utilizadas

Node.js: Plataforma para desenvolvimento backend.
Express: Framework web para Node.js.
TypeScript: Superset de JavaScript com tipagem estática.
Sequelize: ORM para Node.js.
MySQL: Banco de dados relacional.
Swagger: Ferramenta para documentar APIs RESTful.
bcrypt: Para criptografia de senhas.
jsonwebtoken (JWT): Para autenticação baseada em tokens.

# Contribuindo

### Para colaborar com o projeto:

Faça um Fork do projeto.
Crie uma branch para sua funcionalidade (git checkout -b minha-feature).
Faça o commit das suas alterações (git commit -m 'feat: adiciona minha funcionalidade').
Faça o push para a branch (git push origin minha-feature).
Abra um Pull Request.
# NODE-AWS-PB-compass-desafio-3
