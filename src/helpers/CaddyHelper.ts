import { Repositories } from "../repositories";

export interface HostDial { host: string, dial: string }

export class CaddyHelper {

  static async updateCaddy() {
    if (process.env.CADDY_HOST && process.env.CADDY_PORT) {
      const adminUrl = "https://" + process.env.CADDY_HOST + ":" + process.env.CADDY_PORT + "/load";
      const json = await this.generateJson();
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json
      };
      //console.log(adminUrl);
      //console.log(json);
      await fetch(adminUrl, requestOptions);
    }
  }

  static async generateJson() {
    const hostDials: HostDial[] = await Repositories.getCurrent().domain.loadPairs();
    const routes: any[] = [];
    hostDials.forEach(hd => { routes.push(this.getRoute(hd.host, hd.dial, true)) });

    const result = {
      apps: {
        http: {
          servers: {
            srv0: {
              listen: [":" + process.env.CADDY_PORT],
              routes: [this.getRoute(process.env.CADDY_HOST, "localhost:2019", false)]
            },
            srv1: {
              listen: [":443"],
              routes
            }
          }
        }
      }
    }
    return JSON.stringify(result);
  }

  private static getRoute(host: string, dial: string, useHttps: boolean) {
    const result: any = {
      handle: [{
        handler: "subroute",
        routes: [{
          handle: [
            {
              handler: "reverse_proxy",
              headers: {
                request: {
                  set: { Host: ["{http.reverse_proxy.upstream.hostport}"] }
                }
              },
              upstreams: [{ dial }]
            }
          ]
        }]
      }],
      match: [{ host: [host] }],
      terminal: true
    };

    if (useHttps) result.handle[0].routes[0].handle[0].transport = { protocol: "http", tls: {} }
    return result;
  }
}

