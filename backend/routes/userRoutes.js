const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // ตรวจสอบว่ามีการส่ง username และ password หรือไม่
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // ตรวจสอบว่าผู้ใช้งานมีอยู่ในระบบหรือไม่
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword
    });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // ตรวจสอบว่ามีการส่ง username และ password หรือไม่
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_key', { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login user' });
  }
});

module.exports = router;
