import {
  GroupMemberRepository,
  GroupRepository,
  HouseholdRepository,
  PersonRepository,
} from ".";

export class Repositories {
  public groupMember: GroupMemberRepository;
  public group: GroupRepository;
  public household: HouseholdRepository;
  public person: PersonRepository;

  private static _current: Repositories = null;
  public static getCurrent = () => {
    if (Repositories._current === null) Repositories._current = new Repositories();
    return Repositories._current;
  }

  constructor() {
    this.groupMember = new GroupMemberRepository();
    this.group = new GroupRepository();
    this.household = new HouseholdRepository();
    this.person = new PersonRepository();
  }
}
