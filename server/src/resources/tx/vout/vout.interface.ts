export interface Vout {
  value: number;
  n: number;
  scriptPubKey?: Record<string, string>;
  type: string;
  tx?: string;
  address: string;
}
