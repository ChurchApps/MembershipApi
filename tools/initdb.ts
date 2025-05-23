import "reflect-metadata";
import dotenv from "dotenv";
import { Pool } from "@churchapps/apihelper";
import { Environment } from "../src/helpers/Environment";
import { DBCreator } from "@churchapps/apihelper"

const init = async () => {
  dotenv.config();
  await Environment.init(process.env.APP_ENV as string);
  console.log("Connecting");
  Pool.initPool();

  const accessTables: { title: string, file: string }[] = [
    { title: "AccessLogs", file: "accessLogs.mysql" },
    { title: "Churches", file: "churches.mysql" },
    { title: "Domains", file: "domains.mysql" },
    { title: "Role Members", file: "roleMembers.mysql" },
    { title: "Role Permissions", file: "rolePermissions.mysql" },
    { title: "Roles", file: "roles.mysql" },
    { title: "Users", file: "users.mysql" },
    { title: "User Churches", file: "userChurches.mysql" },
    { title: "Populate Data", file: "populateData.mysql" },
  ];

  const formTables: { title: string, file: string }[] = [
    { title: "Answers", file: "answers.mysql" },
    { title: "Forms", file: "forms.mysql" },
    { title: "FormSubmissions", file: "formSubmissions.mysql" },
    { title: "Questions", file: "questions.mysql" },
  ]

  const peopleTables: { title: string, file: string }[] = [
    { title: "Households", file: "households.mysql" },
    { title: "People", file: "people.mysql" },
    { title: "Member Permissions", file: "memberPermissions.mysql" },
    { title: "Notes", file: "notes.mysql" },
  ]

  const groupTables: { title: string, file: string }[] = [
    { title: "Groups", file: "groups.mysql" },
    { title: "Group Members", file: "groupMembers.mysql" },
  ];

  const miscTables: { title: string, file: string }[] = [
    { title: "Errors", file: "clientErrors.mysql" },
    { title: "Settings", file: "settings.mysql" },
    { title: "Usage Trends", file: "usageTrends.mysql" }
  ];

  await initTables("Access", accessTables);
  await initTables("Forms", formTables);
  await initTables("People", peopleTables);
  await initTables("Groups", groupTables);
  await initTables("Misc", miscTables);

}

const initTables = async (displayName: string, tables: { title: string, file: string }[]) => {
  console.log("");
  console.log("SECTION: " + displayName);
  for (const table of tables) await DBCreator.runScript(table.title, "./tools/dbScripts/" + table.file, false);
}

init()
  .then(() => { console.log("Database Created"); process.exit(0); })
  .catch((ex) => {
    console.log(ex);
    console.log("Database not created due to errors");
    process.exit(0);
  });

