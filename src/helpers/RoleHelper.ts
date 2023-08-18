import { Repositories } from "../repositories";
import { Role, RoleMember, RolePermission } from "../models";

export class RoleHelper {
  private repositories: Repositories;

  constructor(private churchId: string, private userId: string) {
    this.repositories = Repositories.getCurrent();
  }

  public async init() {
    await this.createDomainAdminRole();
    await this.createAllMembersRole()
    await this.createEveryoneRole()
    // await this.createChumsRole()
    // await this.createB1Role()
    // await this.createLessonsRole()
    // await this.createStreamingHostRole()
    // await this.createWebsiteAdminRole()
  }

  private async createRole(name: string, permissions: RolePermission[]): Promise<string> {
    let role: Role = {}
    if (name) {
      role = await this.repositories.role.save({ churchId: this.churchId, name });
    }

    const promises: Promise<RolePermission>[] = [];
    permissions.forEach((p) => {
      // roleId will override if permission object has `roleId` property. It is specifically for everyone role
      // where `roleId` is supposed to be kept null.
      const rp = new RolePermission({ churchId: this.churchId, roleId: role.id, ...p });
      promises.push(this.repositories.rolePermission.save(rp));
    });
    await Promise.all(promises);

    return role.id;
  }

  private async createRoleMember(roleId: string) {
    const roleMember: RoleMember = { churchId: this.churchId, roleId, userId: this.userId, addedBy: this.userId };
    await this.repositories.roleMember.save(roleMember);
  }

  private async createDomainAdminRole() {
    /*
    const roleId: string = await this.createRole("Domain Admins", [
      { apiName: "MembershipApi", contentType: "Roles", action: "View" },
      { apiName: "MembershipApi", contentType: "Roles", action: "Edit" },
      { apiName: "MembershipApi", contentType: "Settings", action: "Edit" },
      { apiName: "MembershipApi", contentType: "People", action: "View" },
      { apiName: "MembershipApi", contentType: "People", action: "Edit" },
      { apiName: "MembershipApi", contentType: "Households", action: "Edit" },
      { apiName: "MembershipApi", contentType: "Forms", action: "Admin" }
    ]);*/

    const roleId: string = await this.createRole("Domain Admins", [
      { apiName: "MembershipApi", contentType: "Domain", action: "Admin" },
    ]);

    await this.createRoleMember(roleId)
  }

  private async createAllMembersRole() {
    const roleId: string = await this.createRole("All Members", [
      { apiName: "MembershipApi", contentType: "People", action: "View Members" }
    ])

    await this.createRoleMember(roleId)
  }

  private async createEveryoneRole() {
    await this.createRole("", [
      { apiName: "MembershipApi", contentType: "People", action: "Edit Self", roleId: null },
      { apiName: "AttendanceApi", contentType: "Attendance", action: "Checkin", roleId: null }
    ])
  }

  private async createChumsRole() {
    const roleId: string = await this.createRole("Chums Admins", [
      { apiName: "AttendanceApi", contentType: "Attendance", action: "Checkin" },
      { apiName: "AttendanceApi", contentType: "Attendance", action: "Edit" },
      { apiName: "AttendanceApi", contentType: "Services", action: "Edit" },
      { apiName: "AttendanceApi", contentType: "Settings", action: "Edit" },
      { apiName: "AttendanceApi", contentType: "Attendance", action: "View" },
      { apiName: "AttendanceApi", contentType: "Attendance", action: "View Summary" },
      { apiName: "GivingApi", contentType: "Donations", action: "Edit" },
      { apiName: "GivingApi", contentType: "Settings", action: "Edit" },
      { apiName: "GivingApi", contentType: "Donations", action: "View Summary" },
      { apiName: "GivingApi", contentType: "Donations", action: "View" },
      { apiName: "GivingApi", contentType: "Settings", action: "View" },
      { apiName: "MembershipApi", contentType: "Group Members", action: "Edit" },
      { apiName: "MembershipApi", contentType: "Groups", action: "Edit" },
      { apiName: "MembershipApi", contentType: "Group Members", action: "View" },
      { apiName: "MembershipApi", contentType: "Forms", action: "Edit" },
      { apiName: "MembershipApi", contentType: "Households", action: "Edit" },
      { apiName: "MembershipApi", contentType: "People", action: "Edit" },
      { apiName: "MembershipApi", contentType: "People", action: "Edit Self" },
      { apiName: "MembershipApi", contentType: "People", action: "View Members" },
      { apiName: "MembershipApi", contentType: "People", action: "View" }
    ])

    await this.createRoleMember(roleId)
  }

  private async createB1Role() {
    const roleId: string = await this.createRole("B1 Admins", [
      { apiName: "AttendanceApi", contentType: "Attendance", action: "Checkin" },
      { apiName: "AttendanceApi", contentType: "Attendance", action: "Edit" },
      { apiName: "AttendanceApi", contentType: "Services", action: "Edit" },
      { apiName: "AttendanceApi", contentType: "Settings", action: "Edit" },
      { apiName: "AttendanceApi", contentType: "Attendance", action: "View" },
      { apiName: "AttendanceApi", contentType: "Attendance", action: "View Summary" },
      { apiName: "ContentApi", contentType: "Links", action: "Edit" },
      { apiName: "ContentApi", contentType: "Pages", action: "Edit" },
      { apiName: "ContentApi", contentType: "Settings", action: "Edit" },
      { apiName: "ContentApi", contentType: "Settings", action: "Edit" },
      { apiName: "ContentApi", contentType: "Chat", action: "Host" },
      { apiName: "ContentApi", contentType: "Services", action: "Edit" },
      { apiName: "ContentApi", contentType: "Settings", action: "Edit" },
      { apiName: "GivingApi", contentType: "Donations", action: "Edit" },
      { apiName: "GivingApi", contentType: "Settings", action: "Edit" },
      { apiName: "GivingApi", contentType: "Donations", action: "View Summary" },
      { apiName: "GivingApi", contentType: "Donations", action: "View" },
      { apiName: "GivingApi", contentType: "Settings", action: "View" }
    ])

    await this.createRoleMember(roleId)
  }

  private async createLessonsRole() {
    const roleId: string = await this.createRole("Lessons Admins", [
      { apiName: "LessonsApi", contentType: "Schedules", action: "Edit" }
    ])

    await this.createRoleMember(roleId)
  }

  private async createWebsiteAdminRole() {
    const roleId: string = await this.createRole("Website Admins", [
      { apiName: "ContentApi", contentType: "Links", action: "Edit" },
      { apiName: "ContentApi", contentType: "Content", action: "Edit" }
    ])

    await this.createRoleMember(roleId)
  }


  private async createStreamingHostRole() {
    const roleId: string = await this.createRole("Streaming Hosts", [
      { apiName: "ContentApi", contentType: "Chat", action: "Host" }
    ])

    await this.createRoleMember(roleId)
  }

}
