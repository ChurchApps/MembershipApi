export class Permissions {
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
        view: { contentType: "Forms", action: "View" },
        edit: { contentType: "Forms", action: "Edit" }
    };
}