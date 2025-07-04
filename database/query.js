const pool = require("./pool");

// Get all Blogs with author name
async function getAllBlogs() {
  const blogs = await pool.query(
    `SELECT messages.user_id, 
            messages.id, 
            messages.title, 
            messages.content, 
            messages.timestamp, 
            users.first_name,
            users.last_name
     FROM messages
     JOIN users 
     ON messages.user_id = users.id`
  );
  return blogs.rows;
}

// Get blogs for a certain user
async function getAllBlogsById(id) {
  const blogs = await pool.query(`SELECT * FROM messages WHERE user_id=$1`, [
    id,
  ]);
  return blogs.rows;
}

// Check if that email exists
async function checkEmail(email) {
  const result = await pool.query(`SELECT email FROM users WHERE email=$1`, [
    email,
  ]);
  return result.rows[0];
}

// Add user
async function addUser(firstName, lastName, email, hash) {
  await pool.query(
    `INSERT INTO users (
    first_name,last_name,email,
    password) 
    VALUES ($1,$2,$3,$4)`,
    [firstName, lastName, email, hash]
  );
}

// Send details for a certain user
async function userData(email) {
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  if (result && result.rows && result.rows.length > 0) {
    return result.rows[0];
  }
  return null; // or undefined
}

// Get user data by id
async function userDataById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  return result.rows[0];
}

// Delete all users
async function deleteUsers() {
  await pool.query("TRUNCATE TABLE messages,users RESTART IDENTITY CASCADE");
}
// ------------------- CHECKING MEMBERSHIP & ADMIN STATUS -----------//
async function checkMembership(id) {
  const result = await pool.query(
    "SELECT member_status, admin_status FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
}

// Adding an admin
async function addAdmin(id) {
  await pool.query("UPDATE users SET admin_status = $1 WHERE id=$2", [
    true,
    id,
  ]);
}

// Adding a member
async function addMembership(id) {
  await pool.query("UPDATE users SET member_status=$1 WHERE id=$2", [true, id]);
}
//----------------------  POST MANAGEMENT ------------------//
// Create a post
async function newPost(title, content, id) {
  await pool.query(
    "INSERT INTO messages (title,content,user_id) VALUES($1,$2,$3)",
    [title, content, id]
  );
}

// Grab a post
async function getTheBlog(id) {
  const blog = await pool.query(`SELECT * FROM messages WHERE id=$1`, [id]);
  return blog.rows[0];
}
// Update post
async function updateBlog(id, title, content) {
  await pool.query("UPDATE messages SET title=$2,content=$3 WHERE id=$1", [
    id,
    title,
    content,
  ]);
}
// Delete blog
async function deleteBlog(id) {
  await pool.query("DELETE FROM messages WHERE id=$1", [id]);
}

// Export the functions
module.exports = {
  getAllBlogs,
  getAllBlogsById,
  checkEmail,
  addUser,
  userData,
  userDataById,
  deleteUsers,
  newPost,
  checkMembership,
  addMembership,
  getTheBlog,
  updateBlog,
  deleteBlog,
  addAdmin,
};
