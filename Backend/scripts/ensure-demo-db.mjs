import pg from "pg";

const admin = new pg.Client({
  connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
});

await admin.connect();

const role = await admin.query("select 1 from pg_roles where rolname = 'demo'");
if (!role.rowCount) {
  await admin.query("create role demo login password 'demo'");
  console.log("created role demo");
} else {
  await admin.query("alter role demo with login password 'demo'");
  console.log("updated role demo password");
}

const db = await admin.query("select 1 from pg_database where datname = 'zermae'");
if (!db.rowCount) {
  await admin.query("create database zermae owner demo");
  console.log("created database zermae");
} else {
  console.log("database zermae exists");
}

await admin.query("grant all privileges on database zermae to demo");
await admin.end();

const app = new pg.Client({
  connectionString: "postgresql://demo:demo@127.0.0.1:5432/zermae",
});
await app.connect();
await app.query("grant all on schema public to demo");
await app.query("alter schema public owner to demo");
await app.end();
console.log("demo DB ready");
