# Sistema de Tradução Assíncrona com Microsserviços e Docker

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js) ![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql) ![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.x-FF6600?style=for-the-badge&logo=rabbitmq) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

## 🎯 Objetivo do Projeto

Este projeto demonstra a construção de um sistema distribuído e resiliente para tradução de textos, utilizando uma arquitetura de microsserviços. O objetivo principal é ilustrar conceitos de comunicação assíncrona com filas de mensagens, gestão de estado, e a automação do ambiente de desenvolvimento com Docker Compose.

Foi desenvolvido como parte da disciplina de Tecnologias Emergentes, em Junho de 2025.

## 🏛️ Arquitetura

A aplicação é composta por quatro serviços independentes que rodam em contêineres Docker e se comunicam de forma desacoplada:

1.  **API (`ponto-de-contato`):** Um servidor Node.js/Express responsável por servir o frontend e receber as requisições do cliente. Ele valida a entrada, cria um registro da tarefa no banco de dados com status `queued`, e publica a tarefa em uma fila no RabbitMQ.
2.  **Fila de Mensagens (`o-mensageiro`):** Uma instância do RabbitMQ que atua como intermediário, garantindo que as tarefas enviadas pela API sejam entregues ao Worker de forma segura e assíncrona.
3.  **Worker (`o-tradutor`):** Um serviço Node.js que escuta a fila de trabalho. Ao receber uma tarefa, ele atualiza o status para `processing`, realiza a tradução (detectando o idioma de origem automaticamente), e por fim atualiza o registro no banco com o status `completed` ou `failed`.
4.  **Banco de Dados (`o-arquivo`):** Uma instância do PostgreSQL cujo esquema é criado automaticamente no primeiro boot. Serve como a única fonte da verdade, armazenando o estado e o resultado de cada requisição de tradução.
5.  **Frontend:** Uma interface em HTML e JavaScript puro que utiliza **HTTP Polling** para consultar o status da tradução na API periodicamente e atualizar a tela quando o trabalho é concluído.

## ✨ Funcionalidades Principais

- **Processamento Assíncrono:** A API responde instantaneamente ao usuário enquanto o trabalho pesado é feito em segundo plano.
- **Gestão de Estado:** O ciclo de vida de cada tradução (`queued`, `processing`, `completed`, `failed`) é rastreado no banco de dados.
- **Detecção Automática de Idioma:** O idioma do texto de entrada é detectado pelo Worker.
- **Ambiente Totalmente Containerizado:** Todos os serviços são orquestrados pelo Docker Compose, garantindo um ambiente de desenvolvimento consistente e fácil de iniciar com um único comando.
- **Inicialização Automatizada do Banco:** O esquema da tabela `translations` é criado automaticamente na primeira execução do contêiner do PostgreSQL.

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
- **Banco de Dados:** PostgreSQL
- **Fila de Mensagens:** RabbitMQ
- **Containerização:** Docker, Docker Compose

## 🚀 Como Executar o Projeto

**Pré-requisitos:**
- Docker
- Docker Compose

**Passo 1: Clonar o Repositório**
```bash
git clone https://github.com/KronosZbr/Sistema-de-Traducao-Assincrona
```
**Passo 2: Configurar a Senha**

Abra o arquivo `docker-compose.yml` e substitua os 3 locais com `user` pela senha que desejar.

**Passo 3: Construir e Iniciar os Contêineres**

Com o terminal aberto na pasta raiz do projeto, execute os seguintes comandos:
```bash
# Constrói as imagens customizadas para a API e o Worker
docker-compose build

# Inicia todos os 4 contêineres em conjunto
docker-compose up
```

**Passo 4: Acessar a Aplicação**

- **Aplicação Web:** [http://localhost:3001](http://localhost:3001)
- **Interface do RabbitMQ:** [http://localhost:15672](http://localhost:15672) (usuário: `guest`, senha: `guest`)
- **Conectar ao Banco (via DBeaver/pgAdmin):** Use as credenciais definidas no `docker-compose.yml` com `Host: localhost` e `Port: 5432`.

**Para parar tudo:**
```bash
# Pressione Ctrl + C no terminal onde o 'up' está rodando, ou rode em outro terminal:
docker-compose down
```
