import { Repositories } from "../repositories";
import axios from "axios";
import { Environment } from "./Environment";

export interface HostDial { host: string, dial: string }

export class CaddyHelper {

  static async updateCaddy() {
    if (Environment.caddyHost && Environment.caddyPort) {
      const adminUrl = "https://" + Environment.caddyHost + ":" + Environment.caddyPort + "/load";
      const jsonData = await this.generateJsonData();
      await axios.post(adminUrl, jsonData)
    }
  }

  static async generateJsonData() {
    const hostDials: HostDial[] = await Repositories.getCurrent().domain.loadPairs();
    const routes: any[] = [];
    hostDials.forEach(hd => { routes.push(this.getRoute(hd.host, hd.dial, true)) });
    hostDials.forEach(hd => { routes.push(this.getWwwRoute(hd.host, hd.dial, true)) });

    const result = {
      apps: {
        http: {
          servers: {
            srv0: {
              listen: [":" + Environment.caddyPort],
              routes: [this.getRoute(Environment.caddyHost, "localhost:2019", false)]
            },
            srv1: {
              listen: [":443", ":80"],
              routes
            }
          }
        }
      }
    }
    return result;
  }

  private static getReverseProxyHandler(host: string, dial: string) {
    return {
      handler: "reverse_proxy",
      headers: {
        request: {
          set: { Host: ["{http.reverse_proxy.upstream.hostport}"] }
        }
      },
      upstreams: [{ dial }]
    }
  }

  private static getRewrite(host: string, dial: string) {

    const dialKey = dial.replace(".b1.church:443", "");
    const hostKey = host.replace("https://", "").replace("http://", "").replace("www.", "").replace(".com", "").replace(".org", "").replace(".net", "").replace(".church", "").replace("/", "");

    if (hostKey === dialKey || dialKey.indexOf(":")!==-1) return {};
    else return {
      "uri_substring": [
        {
          "find": "/" + hostKey + "/",
          "replace": "/" + dialKey + "/"
        },
        {
          "find": "/" + hostKey + ".json",
          "replace": "/" + dialKey + ".json"
        },
        {
          "find": "=" + hostKey,
          "replace": "=" + dialKey
        }
      ]
    }
  }


  private static getRoute(host: string, dial: string, useHttps: boolean) {
    const rewrite = this.getRewrite(host, dial);
    const handle:any = this.getReverseProxyHandler(host, dial);
    if (rewrite) handle.rewrite = rewrite;
    if (useHttps) handle.transport = { protocol: "http", tls: {} }


    const result: any = {
      handle: [{
        handler: "subroute",
        routes: [{ handle: [handle] }]
      }],
      match: [{ host: [host] }],
      terminal: true
    };

    // if (useHttps) result.handle[0].routes[0].handle[0].transport = { protocol: "http", tls: {} }
    return result;
  }


  private static getWwwRoute(host: string, dial: string, useHttps: boolean) {

    const result: any = {
      handle: [{
        handler: "static_response",
        "headers": {
          "Location": ["https://" + host + "{http.request.uri}"]
        },
        "status_code": "302"
      }],
      match: [{ host: ["www." + host] }],
      terminal: true
    };

    // if (useHttps) result.handle[0].routes[0].handle[0].transport = { protocol: "http", tls: {} }
    return result;
  }

}

