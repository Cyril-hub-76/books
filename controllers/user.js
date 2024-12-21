// we need User model
const User = require("../models/User");
// we need to hash password
const bcrypt = require("bcrypt");
// to create token
const jwt = require("jsonwebtoken");

exports.signup = (req, resp, next) => {
    // assync func
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        // 201 => create status
        .then(() => resp.status(201).json({ message: "user successfully created"}))
        .catch(error => resp.status(400).json({ error }));
    })
    .catch(error => resp.status(500).json({ error} ));
};

exports.login = (req, resp, next) => {
    // assync func
    User.findOne({email: req.body.email})
    .then(user => {
        if(user === null) { // user is not in bdd
            resp.status(401).json({message: "unvalid user / password"})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    resp.status(401).json({message: "unvalid user / password"})
                } else {
                    resp.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id}, // user is used in encryption to ensure new books are created by the owner
                        "MIIEvQIBADANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ",
                        { expiresIn: "48h" }
                        )
                    })
                }
            })
            .catch(error => resp.status(500).json( {error} ));
        }
    })
    .catch(error => resp.status(500).json( {error} ))
};