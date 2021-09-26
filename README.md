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

See /api for OpenAPI documentation

## Description

This project makes use of: <br>
[Nest](https://github.com/nestjs/nest) <br>
[MongoDB](https://www.mongodb.com/)

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

## Legal

rARAM Backend isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
