import { ExpressContext } from 'apollo-server-express';
import { HouseholdLoader, PeopleLoader } from '../loader';

export type ReqContext = ExpressContext & {
  peopleFromHouseHoldLoader: PeopleLoader
  householdLoader: HouseholdLoader
}