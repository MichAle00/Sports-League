import express from "express";
import cors from "cors";
import teamsRouter from "./routes/teams.js";
import statsRouter from "./routes/stats.js";
import playersRouter from "./routes/players.js";
import matchesRouter from "./routes/matches.js";
import path from "path";
import { fileURLToPath } from "url";
import dbInitRouter from './routes/dbInit.js';


const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/teams", teamsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/players", playersRouter);
app.use("/api/matches", matchesRouter);
app.use('/api', dbInitRouter);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

