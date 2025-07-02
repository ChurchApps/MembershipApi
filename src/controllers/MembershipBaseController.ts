import { Repositories } from "../repositories";
import { CustomBaseController } from "@churchapps/apihelper";
import { Permissions } from "../helpers";
import { AuthenticatedUser } from "@churchapps/apihelper";

export class MembershipBaseController extends CustomBaseController {
  public repositories: Repositories;

  constructor() {
    super();
    this.repositories = Repositories.getCurrent();
  }

  public async formAccess(au: AuthenticatedUser, formId: string, access?: string) {
    if (au.checkAccess(Permissions.forms.admin)) return true;
    if (!formId) return false;
    const formData = await this.repositories.form.loadWithMemberPermissions(au.churchId, formId, au.personId);
    if (formData?.contentType === "form") return formData.action === "admin" || formData.action === access;
    if (au.checkAccess(Permissions.forms.edit)) return true;
    return false;
  }
}
