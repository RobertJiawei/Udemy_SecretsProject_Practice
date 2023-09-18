import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import mongooseEncryption from "mongoose-encryption";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const secret = "This is a secret";
userSchema.plugin(mongooseEncryption, {
  secret: secret,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  await newUser
    .save()
    .then(() => {
      console.log("New user created.");
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", async (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  const foundUser = await User.findOne({ email: userName }).catch((err) => {
    console.log(err);
  });

  if (foundUser) {
    if (foundUser.password === password) {
      console.log("Successfully login.");
      res.render("secrets");
    } else {
      console.log("fail to login.");
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
