import { Vout } from './vout/vout.interface';
import { Vin } from './vin/vin.interface';

export interface TxNonDB {
  hash?: string;
  version?: number;
  size?: number;
  vsize?: number;
  weight?: number;
  locktime?: number;
  vin?: Vin[];
  vout?: Vout[];
  hex?: string;
  confirmations?: number;
  blocktime?: number;
  time?: number;
}

export interface TxDb {
  txid?: string;
  blockhash?: string;
}

export interface Tx extends TxDb, TxNonDB {}
