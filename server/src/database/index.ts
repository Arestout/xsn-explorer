import Sequelize from 'sequelize';
import config from '../config';
import { logger } from '../utils/logger';
import BlockModel from '../resources/blocks/block.model';
import TxModel from './../resources/tx/tx.model';
import VinModel from '../resources/tx/vin/vin.model';
import VoutModel from '../resources/tx/vout/vout.model';
import AddressModel from '../resources/addresses/address.model';

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize.Sequelize(config[env].database, config[env].username, config[env].password, {
  host: config[env].host,
  dialect: config[env].dialect,
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: config[env].pool,
  logQueryParameters: env === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('🟢 The database is connected.');
  })
  .catch((error: Error) => {
    logger.error(`🔴 Unable to connect to the database: ${error}.`);
  });

const DB = {
  Blocks: BlockModel(sequelize),
  Tx: TxModel(sequelize),
  Vin: VinModel(sequelize),
  Vout: VoutModel(sequelize),
  Addresses: AddressModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

Object.keys(DB).forEach(modelName => {
  if (DB[modelName].associate) {
    DB[modelName].associate(DB);
  }
});

export default DB;
