import { AsyncContainerModule } from "inversify";

// This is where all of the binding for constructor injection takes place
export const bindings = new AsyncContainerModule(async (bind) => {
  await require("./controllers");
});
