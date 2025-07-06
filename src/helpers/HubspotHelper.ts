// import Hubspot from "@hubspot/api-client";
import {
  AssociationSpecAssociationCategoryEnum,
  PublicObjectSearchRequest
} from "@hubspot/api-client/lib/codegen/crm/companies";
import { Environment } from ".";
import { AssociationTypes } from "@hubspot/api-client";

// Type declarations for HubSpot client
declare const require: any;

export class HubspotHelper {
  private static getClient = () => {
    const hubspot = require("@hubspot/api-client");
    const client = new hubspot.Client({ accessToken: Environment.hubspotKey });
    return client;
  };

  static lookupCompany = async (query: string) => {
    const client = this.getClient();
    const req: PublicObjectSearchRequest = { query, limit: 1, after: "", sorts: [], properties: [], filterGroups: [] };
    const response = await client.crm.companies.searchApi.doSearch(req);
    return response.results[0];
  };

  static register = async (
    churchId: string,
    companyName: string,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zip: string,
    country: string,
    email: string,
    initialApp: string
  ) => {
    if (Environment.hubspotKey) {
      const client = this.getClient();

      const company: any = {
        properties: {
          church_id: churchId,
          name: companyName,
          description: initialApp,
          address,
          city,
          state,
          zip,
          country
        }
      };

      const contact: any = {
        properties: {
          firstname: firstName,
          lastname: lastName,
          email,
          company: companyName,
          address,
          city,
          state,
          zip,
          country,
          initial_app: initialApp
        }
      };

      const [companyResponse, contactResponse] = await Promise.all([
        client.crm.companies.basicApi.create(company),
        client.crm.contacts.basicApi.create(contact)
      ]);

      await client.crm.associations.v4.basicApi.create(
        "companies",
        companyResponse.id,
        "contacts",
        contactResponse.id,
        [
          {
            associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined,
            associationTypeId: AssociationTypes.companyToContact
          }
        ]
      );
    }
  };

  static setProperties = async (companyId: string, properties: any) => {
    const client = this.getClient();
    try {
      const response = await client.crm.companies.basicApi.update(companyId, { properties });
      return response;
    } catch (error) {
      return { error };
    }
  };
}
