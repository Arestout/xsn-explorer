import { Tx } from '../../tx/interfaces/tx.interface';

interface BlockNonDb {
  strippedsize?: number;
  weight?: number;
  versionHex?: string;
  merkleroot?: string;
  tx?: Tx[];
  confirmations?: number;
}

export interface BlockDb {
  hash: string;
  size: number;
  height: number;
  version: number;
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  tposcontract: null | string;
  previousblockhash: null | string;
  nextblockhash: null | string;
}

export interface Block extends BlockDb, BlockNonDb {}
