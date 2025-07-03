require("dotenv").config();
const express = require("express");
const path = require("path");
const router = require("./routes/routers");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./database/pool");
const port = process.env.PORT;
const passport = require("passport");
require("./authentication/passport");
const flash = require("connect-flash");

// express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Creating session
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET || "my-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);
// Connect passport to the session store
app.use(passport.session());

// Connecting flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.errorLogin = req.flash("error");
  next();
});
// Routing
app.use("/", router);

// Listening port
app.listen(port, () => {
  console.log(`Serving on https://localhost:${port}`);
});
