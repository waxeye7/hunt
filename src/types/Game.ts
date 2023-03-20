export interface Player {
  pos: Pos;
  has_connected: boolean;
  has_moved: boolean;
}

export type Board = Array<Row>;
export type Row = Array<Cell>;

export interface Cell {
  pos: Pos;
  has_survivor: boolean;
  has_hunter: boolean;
  survivor_trail: SurvivorTrail;
  terrain: Terrain;
}

export interface Pos {
  x: number;
  y: number;
}

export interface SurvivorTrail {
  strength: number;
  show: boolean;
}

export interface Terrain {
  active: boolean;
  passable: boolean;
}

export interface Game {
  _id: string;
  hunter: Player;
  survivor: Player;
  board: Board;
  code: string;
}

export type PlayerType = "hunter" | "survivor";
