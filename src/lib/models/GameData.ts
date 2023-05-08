import type { BaseData } from './BaseData';
import type { GameItem } from './GameItem';

export interface GamesData extends BaseData {
	games: GameItem[];
}
