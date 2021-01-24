import dotenv from "dotenv";
import { Pool } from "../src/apiBase/pool";
import { DBCreator } from "../src/apiBase/tools/DBCreator"

const init = async () => {
  dotenv.config();
  console.log("Connecting");
  Pool.initPool();

  const peopleTables: { title: string, file: string }[] = [
    { title: "Households", file: "households.mysql" },
    { title: "People", file: "people.mysql" },
  ]

  const groupTables: { title: string, file: string }[] = [
    { title: "Groups", file: "groups.mysql" },
    { title: "Group Members", file: "groupMembers.mysql" },
  ];

  await DBCreator.init(["Answers", "Forms", "FormSubmissions", "Notes", "Questions"]);
  await initTables("People", peopleTables);
  await initTables("Groups", groupTables);

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

