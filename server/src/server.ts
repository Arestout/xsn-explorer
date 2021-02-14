import 'dotenv/config';
import App from './app';
import { BlocksRoute } from './resources/blocks/block.route';
// import IndexRoute from './routes/index.route';
// import UsersRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new BlocksRoute()]);

app.listen();
