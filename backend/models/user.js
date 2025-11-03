// Simple in-memory User "model" for demo purposes
// In production, replace with a real database (e.g., MongoDB, Postgres)

let users = [
  {
    name: "Priya Singh",
    email: "priya@jt.com",
    designation: "Admin",
    reporter: "-",
    password: "",
    isAdmin: true,
    status: "Active",
  },
  {
    name: "Arjun Sen",
    email: "arjun@jt.com",
    designation: "Recruiter",
    reporter: "Priya Singh",
    password: "",
    isAdmin: false,
    status: "Active",
  },
  {
    name: "Meera Das",
    email: "meera.manager@jt.com",
    designation: "Manager",
    reporter: "Priya Singh",
    password: "",
    isAdmin: false,
    status: "Active",
  },
  {
    name: "Ravi Kumar",
    email: "ravi@jt.com",
    designation: "Recruiter",
    reporter: "Meera Das",
    password: "",
    isAdmin: false,
    status: "Inactive",
  },
];

function listUsers() {
  return users;
}

function createUser(newUser) {
  users.push(newUser);
  return newUser;
}

module.exports = {
  listUsers,
  createUser,
};



