import { ExpressContext } from 'apollo-server-express';
import { IMe } from '../../helpers/account';
import { HouseholdLoader, PeopleFromHouseholdLoader } from '../loader';

export type ReqContext = ExpressContext & {
  me?: IMe
  peopleFromHouseHoldLoader: PeopleFromHouseholdLoader
  householdLoader: HouseholdLoader
}