export interface Player {
  pos: pos
  has_connected: boolean,
  has_moved: boolean,
}

export type Board = Array<Row>;
export type Row = Array<Cell>;
export interface Cell {
  pos: pos,
  has_survivor: boolean,
  has_hunter: boolean,
  survivor_trail: survivor_trail,
  terrain: terrain
}

export interface pos {
  x: number,
  y: number
}

export interface survivor_trail {
  strength: number,
  show: boolean
}

export interface terrain {
  active: boolean,
  passable: boolean
}

export interface Game {
  hunter: Player,
  survivor: Player,
  board: Board,
  code: string,
}

export type PlayerType = "hunter" | "survivor";