import { ExpressContext } from 'apollo-server-express';
import { AuthenticatedUser } from '../../apiBase/auth';
import { IMe } from '../helpers/Authorization';
import { HouseholdLoaderType, PeopleFromHouseholdLoaderType } from '../loaders';

export type ReqContext = ExpressContext & {
  me?: IMe
  au?: AuthenticatedUser
  peopleFromHouseHoldLoader: PeopleFromHouseholdLoaderType
  householdLoader: HouseholdLoaderType
}