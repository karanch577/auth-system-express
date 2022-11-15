const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const User = require("./models/User");

// db connection
const { connect } = require("./config/db");
connect();

// middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

// custom middleware

const auth = require("./middleware/auth")

app.get("/", (req, res) => {
  res.send("Hello from server");
});

// signup route

app.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // check if all the required values are present or not
    if (!(firstname && lastname && email && password)) {
      return res.status(400).json({
        message: "Please enter all the details",
      });
    }

    // check if user already exist

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    const encryPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: encryPassword,
    });

    // creating the token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    console.log("Error in signup route");
  }
});

// signin route
app.post("/signin", async(req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }
    // find the user in the dB
    const user = await User.findOne({ email });

    const hashedPassword = user.password;
    // compare the password
    if (await bcrypt.compare(password, hashedPassword)) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.SECRET,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = undefined;

      res.cookie("token", token, {expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)})

    //   send the user to the frontend
    return res.status(200).json({
        user,
        token,
        success: true
    })
    } else {
      return res.status(400).json({
        message: "Password or email incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    console.log("Error in signin route");
  }
});

app.get("/dashboard", auth, async(req, res) => {
console.log(req.user)
  const user = await User.findOne({_id: req.user.id})
 
  return res.status(200).json({
    user
  })
})

app.get("/signout", (req, res) => {
  res.clearCookie("token")
  return res.status(200).json({
    message: "signout successfully"
  })
})

app.listen(8080, () => {
  console.log("server working");
});
