import { ExpressContext } from 'apollo-server-express';
import { AuthenticatedUser } from '../../apiBase/auth';
import { IMe } from '../helpers/account';
import { HouseholdLoader, PeopleFromHouseholdLoader } from '../loader';

export type ReqContext = ExpressContext & {
  me?: IMe
  au?: AuthenticatedUser
  peopleFromHouseHoldLoader: PeopleFromHouseholdLoader
  householdLoader: HouseholdLoader
}