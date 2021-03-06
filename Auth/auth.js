const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../configurator")


exports.register = async (req, res, next) => {
  const { username, password } = req.body
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" })
  } 
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          {id: user._id, username, role: user.role},
          jwtSecret,
          {
            expiresIn: maxAge,
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        })
      res.status(201).json({
        message: "User successfully created",
        user: user._id,
        role: user.role,
      });
  })
   .catch ((error) =>
    res.status(401).json({
      message: "User not successful created",
      error: error.mesage,
    })
    );
  });
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
          res.status(401).json({
            message: "Login not successful",
            error: "User not found",
          })
        } else {
          bcrypt.compare(password, user.password).then(function (result) {
            if (result) {
              const maxAge = 3 * 60 * 60;
              const token = jwt.sign(
                {
                  id: user._id, username, role: user.role
                },
                jwtSecret,
                {
                  expiresIn: maxAge,
                }
              )
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              });
              res.status(201).json({
                message: "User successfully Logged in",
                user: user._id,
              });
            } else {
              res.status(400).json({message: "Login not succesful"});
            }
          });
        }
      } catch (error) {
        res.status(400).json({
          message: "An error occurred",
          error: error.message,
        })
      }
  };

exports.update = async (req, res, next) => {
    const { role, id } = req.body;
    if (role && id) {
      if (role === "admin") {
        await User.findById(id)
          .then((user) => {
            if (user.role !== "admin") {
              user.role = role;
              user.save((err) => {
                if (err) {
                  return res.status(400).json({ message: "An error occurred", error: err.message });
                  process.exit(1);
                }
                res.status(201).json({ message: "Update successful", user });
              });
            } else {
              res.status(400).json({ message: "User is already an Admin" });
            }
          })
          .catch((error) => {
            res.status(400).json({ message: "An error occurred", error: error.message });
          });
      } else {
        res.status(400).json({message: "Role is not admin",});
      }
    } else {
      res.status(400).json({ message: "Role or Id not present" });
    }
  };