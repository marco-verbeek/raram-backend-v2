
<p align="center">
<a href="https://www.codefactor.io/repository/github/marco-verbeek/raram-backend-v2" target="_blank"><img src="https://www.codefactor.io/repository/github/marco-verbeek/raram-backend-v2/badge"/></a>
<br>Spare-time created tool that analyses League of Legends ARAM games. Uses the official Riot API in order to get match data.
</p>

## Account Verification
Account verification using players' DiscordId and Riot's official Third Party Code endpoint.

## Point System
Points are calculated using:
- team-compared player damage done, taken or healed (NB: only best one is selected and effectively compared and has an impact on LP, to account for supports like Yuumi that do not deal nor take damage.)
- team compared Kill Participation, which boils down to a kills + assists comparison.
- team-compared Deaths

## Endpoints <br>
GET /accounts/verify/:discordId <br>
GET /accounts/verify/:discordId/:summonerName <br>

GET /accounts/:discordId <br>
GET /accounts/:discordId/lastgame <br>

GET /analyses/:gameId

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```