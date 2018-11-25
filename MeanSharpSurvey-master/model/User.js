var mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId; 

var Answer = require('../model/Answer');

var UserSchema = new mongoose.Schema({
  userID: { type: String, unique: true },
  timeZone: {
    type: String, enum: ["PDT", "MST", "CDT", "EDT"], required: function () {
      return "Valid Time zone please ";
    }
  },  
  answers :[{type:ObjectId,index:true,ref:"Answer"}],
  joinDate: { type: Date, default: Date.Now },
  isActive: { type: Boolean, default: true }
});
mongoose.model("User", UserSchema);

//module.exports = mongoose.model("User");
