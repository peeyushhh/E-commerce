const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchmea=new mongoose.Schema({
email:{
    type:String,
    required:true,
    unique:true,
    trim:true
},
cart:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }
]
});
userSchmea.plugin(passportLocalMongoose);
const User=mongoose.model('User',userSchmea);
module.exports=User;