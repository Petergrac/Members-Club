const { Router } = require("express");
const controllers = require("../controllers/controllers");
const passport = require("passport");
const auths = require("../authentication/customAuth");

const router = new Router();

//------------------------------HOMEPAGE----------------------------//
router.get("/", controllers.dashPage);

// --------------------------REGISTRATION---------------------------//
// Registration page
router
  .route("/register")
  .get(controllers.registerForm)
  .post(controllers.addUser);

// --------------------------Authentication-------------------------//
// Login page
router
  .route("/login")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      return controllers.authenticatedUser(req, res, next);
    } else {
      next();
    }
  }, controllers.loginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controllers.authenticatedUser
  );

// -------------------Members Routes---------------------//
// Become a member
router.post("/membership", auths.isAuth, controllers.memberAnswers);
// Create a new post
router.get("/create-post", auths.isAuth, (req, res) => {
  res.render("createPost");
});
router.post("/new", auths.isAuth, controllers.newBlog);
// Edit a post
router
  .route("/edit/:id")
  .get(auths.isAuth,controllers.editBlog)
  .post(auths.isAuth,controllers.updateBlog);
router.post("/delete/:id", auths.isAuth, controllers.deletePost);
// Logout
router.get("/logout", auths.isAuth, controllers.logoutUser);

// --------------------------Admin Routes-----------------------------//
// Admin page
router.post("/admin", auths.isAuth, controllers.adminUser);

module.exports = router;
