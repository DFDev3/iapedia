import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import tools from "./routes/tools.js";
import categories from './routes/categories.js'
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from './generated/prisma/client.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Register backend routes
app.use("/api", routes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// All tools query
app.use('/api/tools', tools)

// All categories query
app.use('/api/categories', categories)

// Fallback for React Router (must stay last)
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
