const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const port = process.env.PORT || 3000;
const API_KEY = "DC9871CCE58A45B6DFAE4AA44DA99";

const app = express();

app.disable("x-powered-by");
app.use(
  express.urlencoded({
    extended: false,
  })
);

//change this to your preference.
mongoose.connect("mongodb://localhost:27017/userdataDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = {
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  email: String,
};

const User = mongoose.model("User", userSchema);

////////////////Request Targeting all users///////////////////////////////////////

app.route("/api/:api_key/users")
  //Get all users.
  .get(function (req, res) {
    if (req.params.api_key === API_KEY) {
      User.find(function (err, foundUsers) {
        if (!err) {
          res.send(foundUsers);
        } else {
          console.log(err);
        }
      });
    } else {
      res.send("Incorrect api-key.");
    }
  })
  //Post new user.
  .post(function (req, res) {
    if (req.params.api_key === API_KEY) {
      bcrypt.hash(
        req.body.password,
        saltRounds,
        function (err, hashedPassword) {
          if (!err) {
            const newUser = new User({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
            });
            newUser.save(function (err) {
              if (!err) {
                res.send("Successfully added a new user.");
              } else {
                res.send(err);
              }
            });
          } else {
            res.send(err);
          }
        }
      );
    } else {
      res.send("Incorrect api-key.");
    }
  })

  //Delete all users.
  .delete(function (req, res) {
    if (req.params.api_key === API_KEY) {
      User.deleteMany(function (err) {
        if (!err) {
          res.send("Successfully deleted all the users.");
        } else {
          res.send(err);
        }
      });
    } else {
      res.send("Incorrect api-key.");
    }
  });

////////////////Request Targeting single user///////////////////////////////////////

app.route("/api/:api_key/user/:id")
  //Get user by id.
  .get(function (req, res) {
    if (req.params.api_key === API_KEY) {
      User.findOne({ _id: req.params.id }, function (err, foundUser) {
        if (!err) {
          if (foundUser) {
            res.send(foundUser);
          } else {
            res.send("Could not find user by given id.");
          }
        } else {
          res.send(err);
        }
      });
    } else {
      res.send("Incorrect api-key.");
    }
  })

  //patch user by id.
  .patch(function (req, res) {
    if (req.params.api_key === API_KEY) {
      User.updateOne({ _id: req.params.id }, req.body, function (err) {
        if (!err) {
          res.send("Successfully updated user: " + req.params.id);
        } else {
          console.log(err);
          res.send(err);
        }
      });
    } else {
      res.send("Incorrect api-key.");
    }
  })

  //Delete one user by id.
  .delete(function (req, res) {
    if (req.params.api_key === API_KEY) {
      User.deleteOne({ _id: req.params.id }, function (err) {
        if (!err) {
          res.send("Successfully deleted the user by id: " + req.params.id);
        } else {
          res.send(err);
        }
      });
    } else {
      res.send("Incorrect api-key.");
    }
  });

//Login
app.post("/api/user/login", function (req, res) {
  const givenUsername = req.body.username;
  const givenPassword = req.body.password;
  User.findOne({ username: givenUsername }, function (err, foundUser) {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(
          givenPassword,
          foundUser.password,
          function (err, result) {
            if (result === true) {
              res.send("Correct username and password.");
            } else {
              res.send("Incorrect password.");
            }
          }
        );
      } else {
        res.send("User not found.");
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(port, function () {
  console.log("Server started on port:", port);
});
