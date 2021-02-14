export interface VinDb {
  txid: string;
  vout: number;
  tx: string;
}

export interface Vin extends VinDb {
  scriptSig?: Record<string, string>;
  txinwitness?: string[];
  sequence?: number;
}
