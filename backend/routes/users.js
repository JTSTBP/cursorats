var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

// GET /users -> list users
router.get('/', function(req, res) {
  const users = UserModel.listUsers();
  res.json(users);
});

// POST /users -> create a new user
router.post('/', function(req, res) {
  const { name, email, designation, reporter, password, isAdmin, status } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ message: 'name and email are required' });
  }

  const user = {
    name,
    email,
    designation: designation || '',
    reporter: reporter || '-',
    password: password || '',
    isAdmin: Boolean(isAdmin),
    status: status || 'Active',
  };
  const created = UserModel.createUser(user);
  res.status(201).json(created);
});

module.exports = router;
