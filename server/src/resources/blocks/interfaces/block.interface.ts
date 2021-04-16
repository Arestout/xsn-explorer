import { Tx } from '../../tx/interfaces/tx.interface';
export interface BlockDTO {
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

export interface Block extends BlockDTO {
  strippedsize: number;
  weight: number;
  versionHex: string;
  merkleroot: string;
  tx: Tx[];
  confirmations: number;
}
