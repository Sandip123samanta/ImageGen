import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { User } from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../mailtrap/email.js';

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        sucess: false,
        message: 'Please fill in all fields',
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        sucess: false,
        message: 'Email already exists.',
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        sucess: false,
        message: 'Username already exists.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        sucess: false,
        message: 'Password must be at least 6 charecters.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      name,
      username,
      password: hashedPassword,
      email,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      sucess: true,
      message: 'User created successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      sucess: false,
      message: `Error creating user : ${error.message}`,
    });
  }
};
export const login = (req, res) => {
  res.send('login');
};
export const logout = (req, res) => {
  res.send('logout');
};
