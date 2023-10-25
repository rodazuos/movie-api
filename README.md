# movie-api

Serviço para catalogar e classificar filmes.

## Tecnologia utilizada

    Serviço desenvoldio utilizando Javascript (NodeJS) e Awilix para injeção de dependência.

    Para a persistencia de dados, foi utilizado o PostgreSQL com o Sequelize.

    O serviço pode ser executado local ou em um container docker.

## Arquitetura

    Microserviço utilizando DDD (Domain Driven Design).

## Sobre o Serviço

### Iniciando o serviço

    O serviço pode ser executado local utilizando o comando `yarn start-dev`. Para isso é necessário criar o arquivo `.env` baseado no `.env.default`, adicionando as informações necessárias.

    // TODO: Como executar em container docker

<br>

| Variáveis de ambiente | Descrição                                              | Valor default                    |
| --------------------- | ------------------------------------------------------ | -------------------------------- |
| PORT                  | Porta para será executado o serviço                    | 3001                             |
| JWT_KEY               | Chave secreta para geração e verificação do JWT        | 123456789                        |
| EXPIRE_TOKEN          | Tempo de expiração do JWT                              | 8h                               |
| SWD_SECRET            | Chave para encriptar dados do JWT                      | d10b850c86c9307d8a7a5aa102d23c69 |
| SWD_IV                | Chave para encriptar dados do JWT                      | 914282356067b88bf66dc01bef2b475c |
| DB_HOST               | Host para a base de dados                              | localhost                        |
| DB_PORT               | Porta para conexão com a base de dados                 | 5432                             |
| DB_USER               | Usuário para acessar a base de dados                   | postgres                         |
| DB_PASS               | Senha do usuário para acesar a base de dados           | admin                            |
| DB_DATABASE           | Nome da base dados                                     | postgres                         |
| DB_POOL_MAX           | Máximo de pool de conexões para reutilização           | 5                                |
| DB_POOL_MIN           | Mínimo de pool de conexões para reutilização           | 1                                |
| DB_POOL_ACQUIRE       | Tempo para obter uma conexão com a base de dados em ms | 30000                            |
| DB_POOL_IDLE          | Tempo de espera para inativar uma conexão em ms        | 10000                            |
| ENABLE_LOG            | Habilita o log local do serviço                        | dev                              |

<br> 
<br>

### Scripts para uso

    Para executar os scripts abaixo, acesse a raiz do projeto através de um terminal e digite o comando desejado.

| Comando      | Descrição                                           |
| ------------ | --------------------------------------------------- |
| start-dev    | Inicia a aplicação local                            |
| start        | Inicia a aplicação em produção                      |
| format:check | Checa a formatação do código utilizando o prettier  |
| format:write | Ajusta a formatação do código utilizando o prettier |
| lint:check   | Análise do código                                   |
| lint:fix     | Corrige problemas no código                         |
| test         | Executa os testes                                   |

<br>

## Coleção

    Na raiz do projeto existe um arquivo `Insomnia.json` com todas as requests necessárias para utilizar o serviço, como Login, Lista de Filmes e etc.

## Extra

    Na raiz do projeto existe o arquivo `generateSecretToCrypto.js`. O script pode ser utilizado para gerar novas chaves de ecriptação. Altere os valores dentro do script e execute o comando no terminal `node generateSecretToCrypto.js`.


## TODO
    - Implementar testes na aplicação