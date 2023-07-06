# NodeJS Fundamentals

<p align="center">
  <img src="https://img.shields.io/static/v1?label=challenge&message=api-node-rest-challenge&color=blueviolet&style=for-the-badge"/>
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/LucasValbusaa/api-node-rest-challenge?color=blueviolet&logo=JavaScript&logoColor=white&style=for-the-badge">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/LucasValbusaa/api-node-rest-challenge?color=blueviolet&style=for-the-badge">
</p>

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#api-rest-nodejs---challenge">Api Rest NodeJS - Challenge</a> •
  <a href="#instalação">Instalação</a> •
  <a href="#tecnologias">Tecnologias</a> •
</p>

## Sobre

Desafio proposto no primeiro módulo do Ignite 2023 na trilha de NodeJS.

## API Rest Nodejs - Challenge
O desafio proposto foi criar uma API para realizar o CRUD a criação de receitas para o usuário. A aplicação contem as seguintes funcionalidades:

## RF
    - [x] O usuário pode registar uma refeição
    - [x] O usuário pode listar todas as refeições
    - [x] O usuário pode apagar uma refeição
    - [x] O usuário pode visualizar uma única refeição
    - [x] O usuário pode recuperar as seguintes métricas
        - Quantidade total de refeições registradas
        - Quantidade total de refeições dentro da dieta
        - Quantidade total de refeições fora da dieta
        - Melhor sequência de refeições dentro da dieta  
 
## RN
    - [x] Deve ser possível criar um usuário
    - [x] Deve ser possível fazer login pelo email
    - [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
        - Nome
        - Descrição
        - Data e Hora
        - Está dentro ou não da dieta
        *As refeições devem ser relacionadas a um usuário.*
    - [x] Deve ser possível identificarmos o usuário entre as requisições
    - [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

### Rotas da aplicação

<details>
  <summary>POST - <code>/users</code></summary>
  <br>
    Cria um usuário utilizando os campos <code>email</code>
</details>

<details>
  <summary>POST - <code>/users/login</code></summary>
  <br>
    Faz um login com um usuário através do email
</details>

<details>
  <summary>POST - <code>/meals</code></summary>
  <br>
    Cria um receita utilizando os campos <code>name</code> e <code>is_on_the_diet</code>
</details>

<details>
  <summary>GET - <code>/meals</code></summary>
  <br>
    Lista todas as receitas do usuário logado
</details>

<details>
  <summary>GET - <code>/meals/:id</code></summary>
  <br>
    Lista uma receita especifica do usuário, passando o id da receita
</details>

<details>
  <summary>GET - <code>/meals/metrics</code></summary>
  <br>
    Informa as métricas relacionado a receitas
</details>

<details>
  <summary>DEL - <code>/meals/:id</code></summary>
  <br>
    Exclui uma receita passando id
</details>

## Instalação

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com) e [Node.js](https://nodejs.org/en/). Além disso é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).

### 🎲 Rodando o Back End (servidor)

```bash
# Clone este repositório
$ git clone git@github.com:LucasValbusaa/api-node-rest-challenge.git

# Acesse a pasta do projeto no terminal/cmd
$ cd api-rest-challenge

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# Para executar os testes
$ npm run test

# O servidor iniciará na porta 3333 - acesse <http://localhost:3333>
```


