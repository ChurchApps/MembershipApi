import { Permissions as BasePermissions } from "../apiBase/helpers";

export class Permissions extends BasePermissions {
  static groups = {
    edit: { contentType: "Groups", action: "Edit" }
  };
  static groupMembers = {
    view: { contentType: "Group Members", action: "View" },
    edit: { contentType: "Group Members", action: "Edit" }
  };
  static households = {
    edit: { contentType: "Households", action: "Edit" }
  };
  static people = {
    view: { contentType: "People", action: "View" },
    viewMembers: { contentType: "People", action: "View Members" },
    edit: { contentType: "People", action: "Edit" },
    editSelf: { contentType: "People", action: "Edit Self" }
  }
  static forms = {
    admin: { contentType: "Forms", action: "Admin" },
    edit: { contentType: "Forms", action: "Edit" },
    access: { contentType: "Forms", action: "Admin" } || { contentType: "Forms", action: "Edit" }
  };


  static server = {
    admin: { contentType: "Server", action: "Admin" },
  };

  static roles = {
    edit: { contentType: "Roles", action: "Edit" },
    view: { contentType: "Roles", action: "View" },
  };

  static roleMembers = {
    view: { contentType: "RoleMembers", action: "View" },
    edit: { contentType: "RoleMembers", action: "Edit" },
  };

  static rolePermissions = {
    view: { contentType: "RolePermissions", action: "View" },
    edit: { contentType: "RolePermissions", action: "Edit" },
  };
}

// ORDER BY apiName, displaySection, displayAction. so before adding new item please maintain order
export const permissionsList: IPermission[] = [
  { apiName: "MembershipApi", section: "RoleMembers", action: "Edit", displaySection: "Access", displayAction: "Edit Role Members" },
  { apiName: "MembershipApi", section: "RolePermissions", action: "Edit", displaySection: "Access", displayAction: "Edit Role Permissions" },
  { apiName: "MembershipApi", section: "Roles", action: "Edit", displaySection: "Access", displayAction: "Edit Roles" },
  { apiName: "MembershipApi", section: "Users", action: "Edit", displaySection: "Access", displayAction: "Edit Users" },
  { apiName: "MembershipApi", section: "RoleMembers", action: "View", displaySection: "Access", displayAction: "View Role Members" },
  { apiName: "MembershipApi", section: "RolePermissions", action: "View", displaySection: "Access", displayAction: "View Role Permissions" },
  { apiName: "MembershipApi", section: "Roles", action: "View", displaySection: "Access", displayAction: "View Roles" },
  { apiName: "MembershipApi", section: "Users", action: "View", displaySection: "Access", displayAction: "View Users" },
  { apiName: "MembershipApi", section: "Settings", action: "Edit", displaySection: "Global", displayAction: "Edit Church Settings" },
  { apiName: "AttendanceApi", section: "Attendance", action: "Checkin", displaySection: "Attendance", displayAction: "Checkin" },
  { apiName: "AttendanceApi", section: "Attendance", action: "Edit", displaySection: "Attendance", displayAction: "Edit Attendance" },
  { apiName: "AttendanceApi", section: "Services", action: "Edit", displaySection: "Attendance", displayAction: "Edit Services" },
  { apiName: "AttendanceApi", section: "Settings", action: "Edit", displaySection: "Attendance", displayAction: "Edit Settings" },
  { apiName: "AttendanceApi", section: "Attendance", action: "View", displaySection: "Attendance", displayAction: "View Attendance" },
  { apiName: "AttendanceApi", section: "Attendance", action: "View Summary", displaySection: "Attendance", displayAction: "View Attendance Summary" },
  { apiName: "B1Api", section: "Links", action: "Edit", displaySection: "B1", displayAction: "Edit Links" },
  { apiName: "B1Api", section: "Pages", action: "Edit", displaySection: "B1", displayAction: "Edit Pages" },
  { apiName: "B1Api", section: "Settings", action: "Edit", displaySection: "B1", displayAction: "Edit Settings" },
  { apiName: "GivingApi", section: "Donations", action: "Edit", displaySection: "Donations", displayAction: "Edit Donations" },
  { apiName: "GivingApi", section: "Settings", action: "Edit", displaySection: "Donations", displayAction: "Edit Settings" },
  { apiName: "GivingApi", section: "Donations", action: "View Summary", displaySection: "Donations", displayAction: "View Donation Summaries" },
  { apiName: "GivingApi", section: "Donations", action: "View", displaySection: "Donations", displayAction: "View Donations" },
  { apiName: "GivingApi", section: "Settings", action: "View", displaySection: "Donations", displayAction: "View Settings" },
  { apiName: "LessonsApi", section: "Schedules", action: "Edit", displaySection: "Lessons", displayAction: "Edit Schedules" },
  { apiName: "MembershipApi", section: "Forms", action: "Admin", displaySection: "Forms", displayAction: "Form Admin" },
  { apiName: "MembershipApi", section: "Forms", action: "Edit", displaySection: "Forms", displayAction: "Edit Forms" },
  { apiName: "MembershipApi", section: "Group Members", action: "Edit", displaySection: "Groups", displayAction: "Edit Group Members" },
  { apiName: "MembershipApi", section: "Groups", action: "Edit", displaySection: "Groups", displayAction: "Edit Groups" },
  { apiName: "MembershipApi", section: "Group Members", action: "View", displaySection: "Groups", displayAction: "View Group Members" },
  { apiName: "MembershipApi", section: "Households", action: "Edit", displaySection: "People", displayAction: "Edit Households" },
  { apiName: "MembershipApi", section: "People", action: "Edit", displaySection: "People", displayAction: "Edit People" },
  { apiName: "MembershipApi", section: "People", action: "Edit Self", displaySection: "People", displayAction: "Edit Self" },
  { apiName: "MembershipApi", section: "People", action: "View Members", displaySection: "People", displayAction: "View Members Only" },
  { apiName: "MembershipApi", section: "People", action: "View", displaySection: "People", displayAction: "View People" },
  { apiName: "StreamingLiveApi", section: "Links", action: "Edit", displaySection: "StreamingLive", displayAction: "Edit Links" },
  { apiName: "StreamingLiveApi", section: "Pages", action: "Edit", displaySection: "StreamingLive", displayAction: "Edit Pages" },
  { apiName: "StreamingLiveApi", section: "Services", action: "Edit", displaySection: "StreamingLive", displayAction: "Edit Services" },
  { apiName: "StreamingLiveApi", section: "Settings", action: "Edit", displaySection: "StreamingLive", displayAction: "Edit Settings" },
  { apiName: "StreamingLiveApi", section: "Tabs", action: "Edit", displaySection: "StreamingLive", displayAction: "Edit Tabs" },
  { apiName: "StreamingLiveApi", section: "Chat", action: "Host", displaySection: "StreamingLive", displayAction: "Host Chat" },
  { apiName: "ContentApi", section: "Links", action: "Edit", displaySection: "Website", displayAction: "Edit Links" }
]

interface IPermission {
  apiName: ApiName;
  section: ContentType;
  action: Actions;
  displaySection: DisplaySection;
  displayAction: string;
}

export type ApiName =
  | "MembershipApi"
  | "StreamingLiveApi"
  | "B1Api"
  | "MembershipApi"
  | "GivingApi"
  | "AttendanceApi"
  | "MessagingApi"
  | "LessonsApi"
  | "ContentApi";

export type DisplaySection =
  | "Access"
  | "Global"
  | "StreamingLive"
  | "B1"
  | "People"
  | "Groups"
  | "Donations"
  | "Attendance"
  | "Lessons"
  | "Forms"
  | "Website";

export type ContentType =
  | "Roles"
  | "RoleMembers"
  | "RolePermissions"
  | "Users"
  | "Settings"
  | "Links"
  | "Pages"
  | "Services"
  | "Tabs"
  | "Settings"
  | "Forms"
  | "Households"
  | "People"
  | "Group Members"
  | "Groups"
  | "Donations"
  | "Attendance"
  | "Chat"
  | "Schedules";

export type Actions = "Admin" | "Edit" | "View" | "Edit Self" | "View Members" | "View Summary" | "Checkin" | "Host";
