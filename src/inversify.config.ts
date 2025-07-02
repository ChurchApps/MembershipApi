import { AsyncContainerModule } from "inversify";

// This is where all of the binding for constructor injection takes place
export const bindings = new AsyncContainerModule(async (bind) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  await require("./controllers");
});
