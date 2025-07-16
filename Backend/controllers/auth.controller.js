const Hr = require("../models/Hr.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hr = await Hr.findOne({ email });

    if (!(await bcrypt.compare(password, hr.password)))
      return next({ st: 401, ms: "Invalid Credentials" });

    const payload = { id: hr._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      data: {
        token,
        message: "Logged In successfully",
        hr: {
          id: hr._id,
        },
      },
    });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = { signIn };
