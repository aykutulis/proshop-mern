import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc    Auth user & Get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('User not found.');
  }

  if (!(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid password.');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: user.generateToken(),
  });
});

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists.');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: user.generateToken(),
  });
});

// @desc    Get user profile
// @route   POST /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) {
    res.status(401);
    throw new Error('User not found.');
  }

  res.json(user);
});

export { authUser, getUserProfile, registerUser };