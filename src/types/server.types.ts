import { ExpressContext } from 'apollo-server-express';
import { HouseholdLoader, PeopleFromHouseholdLoader } from '../loader';

export type ReqContext = ExpressContext & {
  peopleFromHouseHoldLoader: PeopleFromHouseholdLoader
  householdLoader: HouseholdLoader
}