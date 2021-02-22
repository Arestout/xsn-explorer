import { Transaction } from 'sequelize/types';
import { Tx } from './tx.interface';

export interface ITxRepository {
  create(tx: Tx, transaction: Transaction): Promise<void>;
}
