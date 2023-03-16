export interface Player {
  pos: {
    x: number | null,
    y: number | null,
  },
  has_connected: boolean,
  has_moved: boolean,
}

export type Board = Array<Row>;
export type Row = Array<Cell>;
export interface Cell {
  x: number,
  y: number,
}

export interface Game {
  hunter: Player,
  survivor: Player,
  board: Board,
  code: string,
}

export type PlayerType = "hunter" | "survivor";