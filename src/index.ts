import { init } from './App';
import { Pool } from './apiBase/pool';
const port = process.env.SERVER_PORT;

Pool.initPool();

init().then(app => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
});