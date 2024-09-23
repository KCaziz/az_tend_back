import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passport from "passport";
import session from "express-session";
import "./middlewares/passport.js"; //pour la connexion depuis google
import "./cronJobs/subscriptionExpiration.js"; // Importer la tâche planifiée de l'expiration des abonnenements
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// cors middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://az-tend-front.onrender.com"
    ],
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// don't forget to handle the CORS vuln !

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening to port :${PORT}`);
    });
    console.log("App connected to DataBase");
  })
  .catch((error) => {
    console.log(error);
  });
