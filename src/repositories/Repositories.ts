import {
  GroupMemberRepository,
  GroupRepository,
  HouseholdRepository,
  PersonRepository,
  AnswerRepository,
  FormRepository,
  FormSubmissionRepository,
  QuestionRepository,
  MemberPermissionRepository,
} from ".";
import { UserRepository, ChurchRepository, RoleRepository, RoleMemberRepository, RolePermissionRepository, UserChurchRepository, AccessLogRepository } from ".";

export class Repositories {
  public groupMember: GroupMemberRepository;
  public group: GroupRepository;
  public household: HouseholdRepository;
  public person: PersonRepository;
  public answer: AnswerRepository;
  public form: FormRepository;
  public formSubmission: FormSubmissionRepository;
  public question: QuestionRepository;
  public memberPermission: MemberPermissionRepository;

  public accessLog: AccessLogRepository;
  public church: ChurchRepository;
  public role: RoleRepository;
  public roleMember: RoleMemberRepository;
  public rolePermission: RolePermissionRepository;
  public user: UserRepository;
  public userChurch: UserChurchRepository;

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
    this.answer = new AnswerRepository();
    this.form = new FormRepository();
    this.formSubmission = new FormSubmissionRepository();
    this.question = new QuestionRepository();
    this.memberPermission = new MemberPermissionRepository();

    this.accessLog = new AccessLogRepository();
    this.church = new ChurchRepository();
    this.role = new RoleRepository();
    this.roleMember = new RoleMemberRepository();
    this.rolePermission = new RolePermissionRepository();
    this.user = new UserRepository();
    this.userChurch = new UserChurchRepository();
  }
}
