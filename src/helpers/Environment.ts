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

  static async init(environment: string) {
    environment="prod"
    let file = "dev.json";
    if (environment === "staging") file = "staging.json";
    if (environment === "prod") file = "prod.json";


    const relativePath = "../../config/" + file;
    const physicalPath = path.resolve(__dirname, relativePath);

    const json = fs.readFileSync(physicalPath, "utf8");
    const data = JSON.parse(json);
    await this.populateBase(data, "membershipApi", environment);

    this.jwtExpiration = "2 days";
    this.emailOnRegistration = data.emailOnRegistration;
    this.supportEmail = data.supportEmail;
    this.chumsRoot = data.chumsRoot;
    this.messagingApi = process.env.MESSAGING_API || data.messagingApi;
    this.hubspotKey = process.env.HUBSPOT_KEY || await AwsHelper.readParameter(`/${environment}/hubspotKey`);
    this.caddyHost = process.env.CADDY_HOST || await AwsHelper.readParameter(`/${environment}/caddyHost`);
    this.caddyPort = process.env.CADDY_PORT || await AwsHelper.readParameter(`/${environment}/caddyPort`);

  }

}