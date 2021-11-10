import { init } from './App';
import { Pool } from './apiBase/pool';
import { Environment } from './helpers/Environment';
const port = process.env.SERVER_PORT;

Environment.init(process.env.APP_ENV);
Pool.initPool();

init().then(app => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});