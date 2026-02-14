const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../services/auth.service');


router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
