var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../model/User');

var userRepo = require("../dal/userRepo");
var models = require("../model/Answer");

router.post('/', async function (req, res) {
    try {
        var user = await userRepo.createUser(req);
    }
    catch (err) {
        // TODO Log error

        if (err.code == 11000) return res.status(500).send("The user already exists in the system.");
        return res.status(500).send("There was a problem adding the user: " + err.message);
    }
    res.status(200).send(user);
});

router.get('/', async function (req, res) {
    try {
        var users = await userRepo.getUsers();
        res.status(200).send(users);
    }
    catch (err) {
        console.log(err);
        if (err) return res.status(500).send("There was a problem getting users.");
    }
});


router.get('/:id', async function (req, res) {
    try {
        var user = await userRepo.getUser(req.params.id);
        if (!user) return res.status(404).send("No user  found by that id.");
        res.status(200).send(user);
    }
    catch (err) {
        if (err) return res.status(500).send("There was a problem finding the user.");
    }
});

router.get('/userID/:userID', async function (req, res) {
    try {
        var user = await userRepo.getUserByUserID(req.params.userID);
        if (!user) return res.status(404).send("No user  found by that userID.");
        res.status(200).send(user);
    }
    catch (err) {
        if (err) return res.status(500).send("There was a problem finding the user.");
    }
});

// router.delete('/:id', async function (req, res) {
//     //TODO add logic to respond if user not found
//     var result=await userRepo.deleteUser(req.params.id);

//     User.findByIdAndRemove(req.params.id, function (err, user) {
//         if (err) return res.status(500).send("There was a problem deleting the user.");
//         res.status(200).send("User: " + user.name + " was deleted.");
//     });
// });

router.put('/:id', async function (req, res) {
    //TODO add logic to respond if user not found
    try {
        var user = await userRepo.updateUser(req.params.id, req.body);
        res.status(200).send(user);
    }
    catch (err) {
        if (err) return res.status(500).send("There was a problem updating the user.");

    }
});


module.exports = router;


