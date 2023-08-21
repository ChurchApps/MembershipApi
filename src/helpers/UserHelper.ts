import { LoginUserChurch, RolePermission } from "../models";
import { Environment, permissionsList } from ".";
import { ArrayHelper, EmailHelper } from "../apiBase";

export class UserHelper {


  private static addAllPermissions(luc: LoginUserChurch) {
    permissionsList.forEach(perm => {
      let api = ArrayHelper.getOne(luc.apis, "keyName", perm.apiName);
      if (api === null) {
        api = { keyName: perm.apiName, permissions: [] };
        luc.apis.push(api);
      }

      const existing = ArrayHelper.getOne(
        ArrayHelper.getAll(api.permissions, "contentType", perm.section),
        "action",
        perm.action
      );

      if (!existing) {
        const permission: RolePermission = { action: perm.action, contentType: perm.section, contentId:"" }
        api.permissions.push(permission);
      }
    });
  }

  static async replaceDomainAdminPermissions(roleUserChurches: LoginUserChurch[]) {
    roleUserChurches.forEach(luc => {
      luc.apis.forEach(api => {
        if (api.keyName==="MembershipApi") {
          for (let i=api.permissions.length-1; i>=0; i--) {
            const perm = api.permissions[i];
            if (perm.contentType==="Domain" && perm.action==="Admin") {
              api.permissions.splice(i, 1);
              UserHelper.addAllPermissions(luc);
            }
          }
        }
      });
    });
  }

  static sendWelcomeEmail(email: string, loginLink: string, appName: string, appUrl: string): Promise<any> {
    if (!appName) appName = "Live Church Solutions";
    if (!appUrl) appUrl = Environment.chumsRoot;

    console.log(appUrl);
    console.log(loginLink);
    const contents = "<h2>Welcome to " + appName + "</h2>"
      + "<p>Please click the login link below to set your password and continue registration.</p>"
      + `<p><a href="${appUrl + loginLink}" class="btn btn-primary">Set Password</a></p>`;
    return EmailHelper.sendTemplatedEmail(Environment.supportEmail, email, appName, appUrl, "Welcome to " + appName + ".", contents);
  }

  static sendForgotEmail(email: string, loginLink: string, appName: string, appUrl: string): Promise<any> {
    if (!appName) appName = "Live Church Solutions";
    if (!appUrl) appUrl = Environment.chumsRoot;

    const contents = "<h2>Reset Password</h2>"
      + "<h3>Please click the button below to reset your password.</h3>"
      + `<p><a href="${appUrl + loginLink}" class="btn btn-primary">Reset Password</a></p>`;
    ;
    return EmailHelper.sendTemplatedEmail(Environment.supportEmail, email, appName, appUrl, appName + " Password Reset", contents);
  }

}

