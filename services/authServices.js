const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

exports.signup = asyncHandler(async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 12);
  const newUser = await User.create({ ...req.body, password });
  const token = generateToken(newUser._id);
  return res
    .status(201)
    .json({ message: "created successfully", token, data: newUser });
});

exports.login = asyncHandler(async (req, res, next) => {
  const checkEmail = await User.findOne({ email: req.body.email });

  if (
    !checkEmail ||
    !(await bcrypt.compare(req.body.password, checkEmail.password))
  ) {
    return next(new ApiError("incorrect email or password", 401));
  }
  const token = generateToken(checkEmail._id);

  return res
    .status(200)
    .json({ message: "login success", user: checkEmail, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you must login to access this route", 401));
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.userId);

  if (!user) {
    return next(
      new ApiError("the user that belongs to this token no longer exist", 401)
    );
  }

  //check if user change password after create token

  if (user.changePasswordAt) {
    const changPasswordTime = parseInt(
      user.changePasswordAt.getTime() / 1000,
      10
    );
    if (changPasswordTime > user.iat) {
      return next(
        new ApiError(
          "user recently changed his password, please login again",
          401
        )
      );
    }
  }

  req.user = user;
  next();
});

exports.isAllowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you don't have permission to access this route", 403)
      );
    }
    next();
  });


exports.verifyGoogleAuth = asyncHandler(async (req, res, next) => {
  const { googleToken } = req.body;
  if (!googleToken) {
    return next(new ApiError("login failed", 400));
  }
  const decode = jwt.decode(googleToken);
  const checkUser = await User.findOne({ email: decode.email });
  if (checkUser) {
    const token = generateToken(checkUser._id);
    return res
      .status(200)
      .json({ message: "login success", user: checkUser, token });
  } else {
    const newUser = await User.create({
      email: decode.email,
      userName: decode.name,
      profileImg: decode.picture,
    });
    const token = generateToken(newUser._id);
    return res
      .status(201)
      .json({ message: "login success", token, user: newUser });
  }
});
