import database from "infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 100 + 1 as soma");
  console.log(result.rows[0]);
  response.status(200).json({ chave: "são acima da média" });
}

export default status;
