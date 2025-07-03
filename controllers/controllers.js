const { validationResult } = require("express-validator");
const validateUser = require("../validations/validations");
const db = require("../database/query");
const bcrypt = require("bcrypt");

// Homepage
async function dashPage(req, res) {
  try {
    const blogs = await db.getAllBlogs();
    res.render("index", { title: "Homepage", blogs });
  } catch (error) {
    console.log(`Failed to retrieve the messages ${error.message}`);
  }
}
// Display form for registering
async function registerForm(req, res) {
  const fields = req.body;
  res.render("registerForm", { title: "Join Now", errors: null, fields });
}
// Add user to the database
const addUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("registerForm", {
        title: "Join Now",

        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, password } = req.body;
    // Hash the password
    const hash = await bcrypt.hash(password, 10);
    await db.addUser(firstName, lastName, email, hash);
    res.redirect("/login");
  },
];

// Display login page
function loginForm(req, res) {
  res.render("registerForm", {
    title: "Login Here",
  });
}
// Authenticated user
async function authenticatedUser(req, res, next) {
  res.locals.user = req.user;
  const [status, userBlogs, allBlogs] = await Promise.all([
    db.checkMembership(req.user.id),
    db.getAllBlogsById(req.user.id),
    db.getAllBlogs(),
  ]);
  if (!status.member_status) {
    // User is not a member yet
    return res.render("membersPage", {
      title: "Members Club",
      user: req.user,
      blogs: userBlogs,
      allBlogs,
      message: "Answer these questions to become a member:",
      isAdmin: false,
      isMember: false,
      messages: {
        error: req.flash("error"),
        success: req.flash("success"),
      },
    });
  }
  const isAdmin = status.admin_status;
  const isMember = status.member_status;
  res.render("membersPage", {
    title: "Members Club",
    user: req.user,
    blogs: userBlogs,
    allBlogs,
    isAdmin,
    isMember,
    message: null,
    messages: {
      error: req.flash("error"),
      success: req.flash("success"),
    },
  });
}

// Display membership form
async function memberAnswers(req, res) {
  const { q1, q2, q3 } = req.body;
  if (q1 == 4 && (q2 == "skyblue" || q2 == "blue") && q3 === "clubhouse") {
    // Grant Membership
    await db.addMembership(req.user.id);
    res.redirect("/login");
  } else {
    res.send("Wrong answer");
  }
}
// Post new blog
async function newBlog(req, res) {
  const { title, content } = req.body;
  await db.newPost(title, content, req.user.id);
  res.redirect("/login");
}
// Editing a blog
async function editBlog(req, res) {
  const blog = await db.getTheBlog(req.params.id);
  res.render("editBlog", { title: "Edit Post", blog });
}
// Update the blog
async function updateBlog(req, res) {
  const { title, content } = req.body;
  await db.updateBlog(req.params.id, title, content);
  res.redirect("/login");
}
// Deleter a post
async function deletePost(req, res) {
  await db.deleteBlog(req.params.id);
  res.redirect("/login");
}
// logout
function logoutUser(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}
// Authenticate the admin
async function adminUser(req, res) {
  const { adminReason } = req.body;
  const members = await db.checkMembership(req.user.id);

  if (!members || !members.member_status) {
    req.flash("error", "You must be a member before becoming an admin");
    return res.redirect("/login"); // or wherever your member page is
  }

  if (adminReason) {
    await db.addAdmin(req.user.id);
    req.flash("success", "You are now an admin!");
    return res.redirect("/login");
  }

  req.flash("error", "Please provide a reason for admin request.");
  res.redirect("/login");
}
module.exports = {
  dashPage,
  registerForm,
  loginForm,
  addUser,
  authenticatedUser,
  adminUser,
  memberAnswers,
  newBlog,
  editBlog,
  updateBlog,
  deletePost,
  logoutUser,
};
