var utils = require('../utils/Utils');
var User = require('../model/User');

// Gets User  by Object id
async function getUser(id) {
    return await User.findById(id);
}
//Gets User by UserID
async function getUserByUserID(userID) {
    return await User.findOne({ userID: userID });
}

async function getUsers() {
    return await User.find();
}

// TODO Move all db calls in the controller to here 

async function createUser(req) {
    return await User.create({
        userID: req.body.userID,
        timeZone: req.body.timeZone,
        joinDate: Date.now()
    });
}

async function updateUser(id, uValues) {
    return await User.findByIdAndUpdate(req.params.id, uValues, { new: true });

}

module.exports = {
    getUser: getUser,
    getUserByUserID:getUserByUserID,
    getUsers: getUsers,
    createUser: createUser,
    updateUser: updateUser
};
