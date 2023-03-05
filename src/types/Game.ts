export interface Player {
  pos: {
      x: number,
      y: number,
  },
  has_connected: boolean,
  has_moved: boolean,
}

export interface Game {
  hunter: Player,
  survivor: Player,
  code: string,
}

export type PlayerType = "hunter" | "survivor";