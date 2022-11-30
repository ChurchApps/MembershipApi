import { Church } from "../Church";

export type RegisterChurchRequest = Church & {
  appName?: string;
};
