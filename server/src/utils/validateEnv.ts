import { cleanEnv, port, str } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOST: str(),
    POSTGRES_DB: str(),
  });
}

export default validateEnv;
