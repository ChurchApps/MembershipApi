// Global type declarations for MembershipApi

// Extend the interfaces to make them more flexible
declare module "inversify-express-utils" {
  interface IHttpActionResult {
    executeAsync(): Promise<any>;
  }
}

// HubSpot types
declare module '@hubspot/api-client/lib/codegen/crm/companies' {
  export interface AssociationSpecAssociationCategoryEnum {
    [key: string]: any;
  }
  export interface PublicObjectSearchRequest {
    [key: string]: any;
  }
}

declare module '@hubspot/api-client' {
  export interface AssociationTypes {
    [key: string]: any;
  }
}

// Make interfaces more flexible
declare global {
  interface Object {
    length?: number;
    [key: string]: any;
  }
}