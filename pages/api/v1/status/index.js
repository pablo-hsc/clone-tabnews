import database from "infra/database.js";
import { VALID_LOADERS } from "next/dist/shared/lib/image-config";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const dataBaseMaxConnectionsValue = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;

  const dataBaseOpenedConnectionsResult = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  const dataBaseOpenedConnectionsValue =
    dataBaseOpenedConnectionsResult.rows[0].count;

  console.log(dataBaseOpenedConnectionsValue);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: dataBaseMaxConnectionsValue,
        opened_connections: dataBaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
