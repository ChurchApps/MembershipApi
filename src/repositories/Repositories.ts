import {
  GroupMemberRepository,
  GroupRepository,
  HouseholdRepository,
  PersonRepository,
  AnswerRepository,
  FormRepository,
  FormSubmissionRepository,
  QuestionRepository,
} from ".";

export class Repositories {
  public groupMember: GroupMemberRepository;
  public group: GroupRepository;
  public household: HouseholdRepository;
  public person: PersonRepository;
  public answer: AnswerRepository;
  public form: FormRepository;
  public formSubmission: FormSubmissionRepository;
  public question: QuestionRepository;

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
  }
}
