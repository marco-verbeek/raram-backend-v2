import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysesService {
  analyseGameWithId(gameId: string) {
    return `Analysis of game with id #${gameId}`;
  }
}
