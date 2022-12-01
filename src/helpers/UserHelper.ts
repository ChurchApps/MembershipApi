import { Environment } from ".";
import { EmailHelper } from "../apiBase";

export class UserHelper {
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

