import _ from 'lodash'
import { UserInputError } from 'apollo-server'
import { QueryPeopleArgs, QueryPersonArgs, ReqContext, Person, HouseHold } from '../types'
import { PaginationHelper, Authorization, PrismaHelper } from '../helpers'
import { Permissions } from '../../helpers/Permissions'

export class PersonResolver {

  private static personQuery = async (root: unknown, args: QueryPersonArgs, ctx: ReqContext): Promise<Person | null> => {
    Authorization.requirePermission(ctx.me, Permissions.people.view);
    const { id } = args.where;
    if (!id) throw new UserInputError('user_id is required');
    const churchId = ctx.me?.churchId;
    const person = await PrismaHelper.getClient().people.findFirst({
      where: { id, churchId, }
    });
    return person;
  }

  private static peopleQuery = async (root: any, args: QueryPeopleArgs, ctx: ReqContext): Promise<Person[] | null> => {
    Authorization.requirePermission(ctx.me, Permissions.people.view);
    const { from, size } = PaginationHelper.initPagination(args.pagination);
    const churchId = ctx.me?.churchId;
    let people = await PrismaHelper.getClient().people.findMany({
      skip: from,
      take: size,
      where: { ...args.where, churchId, },
      include: {
        groups: {
          include: { group: true }
        },
      },
    });

    people = people.map(person => {
      const groups: any[] = [];
      person.groups.forEach(g => { if (g.group) groups.push(g.group) });
      person.groups = groups;
      return person;
    });
    return people;
  }

  private static personHouseholdQuery = async (root: Person, args: null, ctx: ReqContext): Promise<HouseHold | null> => {
    if (!root.household) return ctx.householdLoader.load(root.householdId);
    return root.household;
  }

  public static getResolver = () => {
    return {
      Query: {
        person: PersonResolver.personQuery,
        people: PersonResolver.peopleQuery,
      },
      Person: {
        household: PersonResolver.personHouseholdQuery
      }
    }
  }

}
