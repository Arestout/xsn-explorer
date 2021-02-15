import 'dotenv/config';
import App from './app';

import { BlocksRoute } from './resources/blocks/block.route';
import { TxRoute } from './resources/tx/tx.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new BlocksRoute(), new TxRoute()]);

app.listen();
