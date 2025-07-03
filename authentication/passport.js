const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("../database/query");

async function verifyLogin(email, password, done) {
  try {
    const myData = await db.userData(email);
    if (!myData || !myData.email) {
      return done(null, false, { message: "Incorrect email." });
    }
    const isValid = await bcrypt.compare(password, myData.password);
    if (!isValid) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, myData);
  } catch (error) {
    done(error);
  }
}

passport.use(
  new LocalStrategy(
    { usernameField: "userEmail", passwordField: "userPassword" },
    verifyLogin
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.userDataById(id);
    if (!user) {
      return done(null, false); // No user found, invalidate session
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});