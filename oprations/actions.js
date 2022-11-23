const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../db");
const { Error } = require("../errors/globelError");
const { storage } = require("../storage");

const SignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIRES_IN,
  });
};

exports.GetAllUsers = async (_req, res) => {
  const AllUsers = await User.find();
  try {
    res.status(200).json({
      status: "success",
      data: AllUsers,
    });
  } catch (error) {}
};

exports.Signup = async (req, res) => {
  const { name, email, password, role, confirmPassword } = req.body;
  let { avatar } = req.body;
  if (!avatar) {
    avatar = `https://ui-avatars.com/api/?name=${name.replace(
      " ",
      ""
    )}&format=svg`;
  }

  try {
    const CreatedUser = await User.create({
      name,
      email,
      avatar,
      password,
      role,
      confirmPassword,
    });

    const Token = SignToken(CreatedUser._id);

    res.status(200).json({
      status: "success",
      message: "user created successfully",
      token: Token,
      data: CreatedUser,
    });
  } catch (error) {
    const msg = error?.code === 11000 ? "user already exists" : error.message;
    Error(res, msg, 401);
  }
};

exports.login = async (req, res, _next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    Error(res, "please provide a email and password", 401);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.ComparePassword(password, user.password))) {
    Error(res, "incorrect email or password", 401);
  } else {
    const token = SignToken(user._id);
    res.status(200).json({
      staus: "success",
      token,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer")) {
    token = auth.split(" ")[1];
  }

  if (!auth) {
    return Error(res, "you are not logged in please provide a token", 401);
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const curUser = await User.findById(decoded.id);

    if (curUser) {
      return next();
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return Error(res, "invalid token", 403);
    }
    if (error.name === "TokenExpiredError") {
      return Error(res, "token is expired,please login again", 403);
    } else {
      return Error(res, error, 403);
    }
  }
};

exports.verifyUser = async (req, res, _next) => {
  const id = req.query.id;

  if (!id) {
    Error(res, "please provide a id", 300);
  }

  try {
    const verifedUser = await User.findOneAndUpdate(
      { _id: id },
      { isVerified: true, verifiedOn: Date.now() }
    );

    if (verifedUser && !verifedUser.isVerified) {
      res.status(200).json({
        status: "success",
        data: verifedUser,
      });
    } else {
      res.status(200).json({
        status: "invalid request",
        message: "User is already verifeid",
      });
    }
  } catch (error) {
    if (error.name === "CastError") {
      Error(res, "User not found with this id", 500);
    } else {
      Error(res, error, 500);
    }
  }
};

exports.upload = (req, res, next) => {
  if (req.file) {
    res.status(200).json({
      status: "success",
      message: "file upload successfully",
      data: req.file,
    });
  } else {
    Error(res, "something went wrong", 500);
  }
};
