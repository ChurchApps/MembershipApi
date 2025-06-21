import { init } from "./App";
import { Pool } from "@churchapps/apihelper";
import { Environment } from "./helpers/Environment";
const port = process.env.SERVER_PORT;

Environment.init(process.env.APP_ENV).then(() => {
  Pool.initPool();

  init().then(app => {
    app.listen(port, () => {
      // Server started - this is development mode only
    });
  });
});
