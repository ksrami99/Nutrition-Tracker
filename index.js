const express = require("express");
const mongosoe = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("./mdoels/userModel");
const foodModel = require("./mdoels/foodModel");
const trackingModel = require("./mdoels/trackingModel");

// middleware
const verifyToken = require("./middlewares/verifyToken");

// DB connection

mongosoe
    .connect(
        "mongodb+srv://admin:h7Uxo4o6AMzlPYjj@cluster0.9iez3yz.mongodb.net/Nutrition"
    )
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(express.json());

// Register

app.post("/register", (req, res) => {
    let user = req.body;

    // check if user already registered

    userModel.findOne({ email: user.email }).then((data) => {
        if (data != null) {
            res.send({ message: "User already registered" });
            return;
        } else {
            // register user using bcrypt to hash password
            bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (!err) {
                            user.password = hash;

                            userModel
                                .create(user)
                                .then((dac) => {
                                    res.status(201).send({
                                        message: "User Registered",
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(500).send("Something is wrong");
                                });
                        } else {
                            console.log(err);
                        }
                    });
                }
            });
        }
    });
});

// Login

app.post("/login", (req, res) => {
    let userCred = req.body;

    userModel
        .findOne({ email: userCred.email })
        .then((user) => {
            if (user != null) {
                bcrypt.compare(
                    userCred.password,
                    user.password,
                    (err, success) => {
                        if (success == true) {
                            jwt.sign(
                                { email: userCred.email },
                                "123",
                                (err, token) => {
                                    if (!err) {
                                        res.send({
                                            message: "Login Success",
                                            token: token,
                                        });
                                    }
                                }
                            );
                        } else {
                            res.status(403).send({
                                message: "Incorrect password",
                            });
                        }
                    }
                );
            } else {
                res.status(404).send({ message: "User not Found" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.send({ message: "Somethis is wrong" });
        });
});

// fatching all the foods

app.get("/foods", verifyToken, (req, res) => {
    foodModel
        .find()
        .then((foods) => {
            res.send(foods);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: "Some happened when getting data",
            });
        });
});

// Search food by name

app.get("/foods/:name", verifyToken, (req, res) => {
    let name = req.params.name;

    foodModel
        .find({ name: { $regex: name, $options: "i" } })
        .then((foods) => {
            if (foods !== 0) {
                res.send(foods);
            } else {
                res.status(404).send({
                    message: "Food item not found",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: "Some happened when getting data",
            });
        });
});

// endpoint to track a food

app.post("/track", verifyToken, (req, res) => {
    let trackData = req.body;

    trackingModel
        .create(trackData)
        .then((data) => {
            res.status(201).send({ message: "Food Added" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: "Some Problem in Getting the food item",
            });
        });
});

// endpoint for fetch all food eaten by a person

app.get("/track/:userId/", verifyToken, (req, res) => {
    let userId = req.params.userId;

    trackingModel
        .find({ userId: userId }).populate('userId').populate('foodId')
        .then((foods) => {
            res.send(foods)
        })
        .catch((err) => {
            console.log(err);
            res.send({ meaassage: "Somethig want wrong" });
        });
});

app.listen(3000, () => {
    console.log("Server is up and running");
});
