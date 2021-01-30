export class Permissions {
    static groups = {
        view: { contentType: "Groups", action: "View" },
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
        edit: { contentType: "People", action: "Edit" }
    }
}