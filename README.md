# movie-api

Serviço para catalogar e classificar filmes.

## Tecnologia utilizada

    Serviço desenvolvido utilizando Javascript (NodeJS) e Awilix para injeção de dependência.

    Para a persistencia de dados, será utilizado o PostgreSQL.

    O serviço deverá ser executado em container docker.

## Arquitetura

    Será um microserviço utilizando DDD (Domain Driven Design).

## Sobre o Serviço

1- Autenticação - O acesso ao sistema será através de JWT

2- Cadastro de Acessos - Tipos de perfis: Admin e visitante

    1.1- Permissões
        - Admin
            - Cadastra e gerencia usuários
            - Cadastra e gerencia filmes

        - Visitante
            - Edita seu cadastro
            - Consulta filmes
            - Vota nos filmes

3- Cadastro de Filmes - Titulo - Titulo Original - Ano de lançamento - Faixa etária - Duração - Descrição - Cartaz - Diretor - Roteiristas - Gênero - Artistas

    2.1 Funcionalidades
        - Contagem e média de votos de 1 à 4
        - Listagem de filmes com filtro por Diretor, nome, gênero e/ou atores
