# Members Clubhouse

A Node.js web application for a members-only club, featuring user registration, authentication, blog posting, membership quizzes, and admin privileges.

## Features

- User registration and login with hashed passwords
- Passport.js authentication (local strategy)
- Session management with PostgreSQL-backed sessions
- Membership quiz: users must answer questions to become members
- Admin privilege request and approval
- Blog posting: users can create, edit, and delete their own posts
- Flash messages for user feedback
- Responsive EJS templates for all pages

## Folder Structure

```
.
├── authentication/
│   ├── customAuth.js         # Custom authentication middleware (isAuth, isAdmin)
│   └── passport.js           # Passport.js configuration (strategies, serialize/deserialize)
├── controllers/
│   └── controllers.js        # Route handlers for registration, login, membership, blogs, admin
├── database/
│   ├── pool.js               # PostgreSQL connection pool setup
│   └── query.js              # Database query functions (users, blogs, membership)
├── routes/
│   └── routers.js            # Express route definitions
├── validations/
│   └── validations.js        # express-validator rules for forms
├── views/
│   ├── index.ejs             # Homepage
│   ├── registerForm.ejs      # Registration and login form
│   ├── membersPage.ejs       # Members-only dashboard
│   └── editBlog.ejs          # Blog editing form
├── schema.sql                # PostgreSQL schema for users, messages, membership
├── app.js                    # Main Express app setup
├── package.json
└── README.md
```

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file with your PostgreSQL connection string and session secret.

3. **Set up the database:**
   - Run the SQL in `schema.sql` to create the necessary tables.

4. **Start the app:**
   ```sh
   npm start
   ```

5. **Visit:**
   - [http://localhost:3000](http://localhost:3000)

## Main Technologies

- Node.js
- Express.js
- Passport.js
- PostgreSQL
- EJS
- express-session & connect-pg-simple
- express-validator
-