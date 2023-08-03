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
}

// ORDER BY apiName, displaySection, displayAction. so before adding new item please maintain order
export const permissionsList: IPermission[] = [
  { apiName: "AttendanceApi", section: "Attendance", action: "Checkin", displaySection: "Attendance", displayAction: "Checkin" },
  { apiName: "AttendanceApi", section: "Attendance", action: "Edit", displaySection: "Attendance", displayAction: "Edit Attendance" },
  { apiName: "AttendanceApi", section: "Services", action: "Edit", displaySection: "Attendance", displayAction: "Edit Services" },
  { apiName: "AttendanceApi", section: "Attendance", action: "View", displaySection: "Attendance", displayAction: "View Attendance" },
  { apiName: "AttendanceApi", section: "Attendance", action: "View Summary", displaySection: "Attendance", displayAction: "View Attendance Summary" },
  { apiName: "GivingApi", section: "Donations", action: "Edit", displaySection: "Donations", displayAction: "Edit Donations" },
  { apiName: "GivingApi", section: "Settings", action: "Edit", displaySection: "Donations", displayAction: "Edit Settings" },
  { apiName: "GivingApi", section: "Donations", action: "View Summary", displaySection: "Donations", displayAction: "View Donation Summaries" },
  { apiName: "GivingApi", section: "Donations", action: "View", displaySection: "Donations", displayAction: "View Donations" },
  { apiName: "LessonsApi", section: "Schedules", action: "Edit", displaySection: "Lessons", displayAction: "Edit Schedules" },
  { apiName: "MembershipApi", section: "Forms", action: "Admin", displaySection: "Forms", displayAction: "Form Admin" },
  { apiName: "MembershipApi", section: "Forms", action: "Edit", displaySection: "Forms", displayAction: "Edit Forms" },
  { apiName: "MembershipApi", section: "Group Members", action: "Edit", displaySection: "People and Groups", displayAction: "Edit Group Members" },
  { apiName: "MembershipApi", section: "Groups", action: "Edit", displaySection: "People and Groups", displayAction: "Edit Groups" },
  { apiName: "MembershipApi", section: "Households", action: "Edit", displaySection: "People and Groups", displayAction: "Edit Households" },
  { apiName: "MembershipApi", section: "People", action: "Edit", displaySection: "People and Groups", displayAction: "Edit People" },
  { apiName: "MembershipApi", section: "People", action: "Edit Self", displaySection: "People and Groups", displayAction: "Edit Self" },
  { apiName: "MembershipApi", section: "Roles", action: "Edit", displaySection: "People and Groups", displayAction: "Edit Roles and Users" },
  { apiName: "MembershipApi", section: "Group Members", action: "View", displaySection: "People and Groups", displayAction: "View Group Members" },
  { apiName: "MembershipApi", section: "People", action: "View Members", displaySection: "People and Groups", displayAction: "View Members Only" },
  { apiName: "MembershipApi", section: "People", action: "View", displaySection: "People and Groups", displayAction: "View People" },
  { apiName: "MembershipApi", section: "Roles", action: "View", displaySection: "People and Groups", displayAction: "View Roles and Users" },
  { apiName: "MembershipApi", section: "Settings", action: "Edit", displaySection: "Content", displayAction: "Edit Church Settings" },
  { apiName: "ContentApi", section: "Content", action: "Edit", displaySection: "Content", displayAction: "Edit Content" },
  { apiName: "ContentApi", section: "Settings", action: "Edit", displaySection: "Content", displayAction: "Edit Settings" },
  { apiName: "ContentApi", section: "StreamingServices", action: "Edit", displaySection: "Content", displayAction: "Edit Services" },
  { apiName: "ContentApi", section: "Chat", action: "Host", displaySection: "Content", displayAction: "Host Chat" },
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
  | "MembershipApi"
  | "GivingApi"
  | "AttendanceApi"
  | "MessagingApi"
  | "LessonsApi"
  | "ContentApi";

export type DisplaySection =
  | "People and Groups"
  | "Donations"
  | "Attendance"
  | "Lessons"
  | "Forms"
  | "Content";

export type ContentType =
  | "Roles"
  | "Settings"
  | "Links"
  | "Pages"
  | "Services"
  | "StreamingServices"
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
  | "Schedules"
  | "Content";

export type Actions = "Admin" | "Edit" | "View" | "Edit Self" | "View Members" | "View Summary" | "Checkin" | "Host";
