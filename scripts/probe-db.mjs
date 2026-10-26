import pg from "pg";

const user = process.env.USERNAME || "apex";
const urls = [
  `postgresql://${user}@127.0.0.1:5432/postgres`,
  `postgresql://postgres@127.0.0.1:5432/postgres`,
  "postgresql://demo:demo@127.0.0.1:5432/postgres",
  "postgresql://zermae:demo@127.0.0.1:5432/postgres",
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
  "postgresql://postgres:admin@127.0.0.1:5432/postgres",
  "postgresql://postgres:password@127.0.0.1:5432/postgres",
];

for (const url of urls) {
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    const result = await client.query("select current_user, current_database()");
    console.log("OK", url.replace(/:([^:@/]+)@/, ":***@"), result.rows[0]);
    await client.end();
    process.exit(0);
  } catch (error) {
    console.log("FAIL", url.replace(/:([^:@/]+)@/, ":***@"), error.message);
    try {
      await client.end();
    } catch {
      // ignore
    }
  }
}
process.exit(1);
