import express from "express";
import cors from "cors";
import sportsRouter from "./routes/sports.js";
import teamsRouter from "./routes/teams.js";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/sports", sportsRouter);
app.use("/api/teams", teamsRouter);


app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
