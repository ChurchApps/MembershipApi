// import Hubspot from "@hubspot/api-client";
import { PublicObjectSearchRequest } from "@hubspot/api-client/lib/codegen/crm/companies";

import { Environment } from ".";

export class HubspotHelper {
  static contactId: string = "";
  static companyId: string = "";

  private static getClient = () => {
    const hubspot = require('@hubspot/api-client')
    const client = new hubspot.Client({ accessToken: Environment.hubspotKey })
    return client;
  }

  static lookupCompany = async (query: string) => {
    const client = this.getClient();
    const req: PublicObjectSearchRequest = { query: query, limit: 1, after: "", sorts: [], properties: [], filterGroups: [] }
    const response = await client.crm.companies.searchApi.doSearch(req);
    return response.results[0];
  }

  static register = async (churchId: string, companyName: string, firstName: string, lastName: string, address: string, city: string, state: string, zip: string, country: string, email: string, initialApp: string) => {
    if (Environment.hubspotKey) {
      const client = this.getClient();

      const company: any = {
        properties: { church_id: churchId, name: companyName, description: initialApp, address, city, state, zip, country }
      }

      const contact: any = {
        properties: { firstname: firstName, lastname: lastName, email, company: companyName, address, city, state, zip, country, initial_app: initialApp }
      }

      const promises: Promise<any>[] = [];
      promises.push(
        client.crm.companies.basicApi.create(company).then((companyResponse: any) => {
          this.companyId = companyResponse.body.id
        })
      );
      promises.push(
        client.crm.contacts.basicApi.create(contact).then((contactResponse: any) => {
          this.contactId = contactResponse.body.id
        })
      );
      await Promise.all(promises);
      await client.crm.companies.associationsApi.create(this.companyId, 'contacts', this.contactId, 'company_to_contact');
    }
  }

  static setProperties = async (companyId: string, properties: any) => {
    const client = this.getClient();
    try {
      const response = await client.crm.companies.basicApi.update(companyId, { properties });
      return response;
    } catch (error) {
      console.log(error);
      return { error };
    }
  }




}