import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import tools from "./routes/tools.js";
import categories from './routes/categories.js'
import seed from './routes/seed.js'
import labels from './routes/labels.js'
import users from './routes/users.js'
import reviews from './routes/reviews.js'
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

// Labels management
app.use('/api/labels', labels)

// Users management
app.use('/api/users', users)

// Reviews management
app.use('/api/reviews', reviews)

// Seed route
app.use('/api/seed', seed)

// Fallback for React Router (must stay last)
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
