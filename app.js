//CREATION DE MON APPLICATION 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const Auth_Router = require("./routes/route_auth");
const Reset_Router = require("./routes/route_reset");
const Categories_Router = require("./routes/route_categories")
const Budget_Router = require("./routes/route_budget")
const Expense_Router = require("./routes/route_depenses")
const Stats_Router = require("./routes/route_statistiques")
const Profil_Router = require("./routes/route_profil")

app.use(cors());
app.use(express.json());

// Établir la connexion à la base de données
mongoose.connect(process.env.DB_NAME)
  .then(() => console.log("Base de donneés connectées"))
  .catch(() => console.log("Echec de connection à la base des données"));

// Configurer les routes
app.use("/api/auth", Auth_Router);
app.use("/api/auth", Reset_Router);
app.use("/api/categories", Categories_Router);
app.use("/api/budgets", Budget_Router);
app.use("/api/depense", Expense_Router);
app.use("/api/stats", Stats_Router);
app.use("/api/profil", Profil_Router);

module.exports = app;
