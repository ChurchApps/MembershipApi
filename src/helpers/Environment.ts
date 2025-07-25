import fs from "fs";
import path from "path";

import { AwsHelper, EnvironmentBase } from "@churchapps/apihelper";

export class Environment extends EnvironmentBase {
  static jwtExpiration: string;
  static emailOnRegistration: boolean;
  static supportEmail: string;
  static chumsRoot: string;
  static messagingApi: string;
  static hubspotKey: string;
  static caddyHost: string;
  static caddyPort: string;
  static aiProvider: string;
  static openRouterApiKey: string;
  static openAiApiKey: string;

  static async init(environment: string) {
    let file = "dev.json";
    if (environment === "staging") file = "staging.json";
    if (environment === "prod") file = "prod.json";

    // In Lambda, __dirname is /var/task/dist/src/helpers
    // Config files are at /var/task/config
    let physicalPath: string;

    // Check if we're in actual Lambda (not serverless-local)
    const isActualLambda = process.env.AWS_LAMBDA_FUNCTION_NAME && __dirname.startsWith("/var/task");

    if (isActualLambda) {
      // In Lambda, config is at root level
      physicalPath = path.resolve("/var/task/config", file);
    } else {
      // In local development, resolve from the project root
      const projectRoot = path.resolve(__dirname, "../../");
      physicalPath = path.resolve(projectRoot, "config", file);
    }

    const json = fs.readFileSync(physicalPath, "utf8");
    const data = JSON.parse(json);
    await this.populateBase(data, "membershipApi", environment);

    this.jwtExpiration = "2 days";
    this.emailOnRegistration = data.emailOnRegistration;
    this.supportEmail = data.supportEmail;
    this.chumsRoot = data.chumsRoot;
    this.messagingApi = process.env.MESSAGING_API || data.messagingApi;
    this.hubspotKey = process.env.HUBSPOT_KEY || (await AwsHelper.readParameter(`/${environment}/hubspotKey`));
    this.caddyHost = process.env.CADDY_HOST || (await AwsHelper.readParameter(`/${environment}/caddyHost`));
    this.caddyPort = process.env.CADDY_PORT || (await AwsHelper.readParameter(`/${environment}/caddyPort`));
    this.aiProvider = data.aiProvider;
    this.openRouterApiKey =
      process.env.OPENROUTER_API_KEY || (await AwsHelper.readParameter(`/${environment}/openRouterApiKey`));
    this.openAiApiKey = process.env.OPENAI_API_KEY || (await AwsHelper.readParameter(`/${environment}/openAiApiKey`));
  }
}
