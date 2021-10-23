import { Repositories } from "../repositories";
import { CustomBaseController } from "../apiBase/controllers"
import { Permissions } from "../helpers";
import { AuthenticatedUser } from "../apiBase/auth";

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
        if (au.checkAccess(Permissions.forms.create)) return true;
        return false;
    }

}
