import { Game } from './game.interface';
import { Team } from './team.interface';
import { Player } from './player.interface';

export interface Analysis {
  game: Game;
  teams: Team[];
  players: Player[];
}
