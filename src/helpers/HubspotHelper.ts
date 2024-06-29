// import Hubspot from "@hubspot/api-client";
import { Environment } from ".";

export class HubspotHelper {
  static contactId: string = "";
  static companyId: string = "";

  static register = async (companyName: string, firstName: string, lastName: string, address: string, city: string, state: string, zip: string, country:string, email: string, initialApp: string) => {
    if (Environment.hubspotKey) {
      const hubspot = require('@hubspot/api-client')
      // const client = new hubspot.Client({ apiKey: Environment.hubspotKey })
      const client = new hubspot.Client({ accessToken: Environment.hubspotKey })

      const company: any = {
        properties: { name: companyName, description: initialApp, address, city, state, zip, country }
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
}