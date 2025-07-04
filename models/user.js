const mongoose = require('mongoose');
const {createHmac, randomBytes} = require("crypto");
const {Schema, Model} = require('mongoose');
const { createTokenForUser } = require('../services/authentication');
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required:true,
        unique: true,
    },
    salt:{
        type: String,
        //required: true,
    },
    password:{
        type: String,
        required: true,
    },
    profileImageURL:{
        type: String,
        default: "/images/default.png",
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
}, {timestamps: true} );

userSchema.pre("save", function(next){
    const user = this;

    if (!user.isModified("password")) return next(); // ← FIXED: call next()

    const salt = randomBytes(16).toString("hex"); // ← FIXED: ensure hex encoding
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;

    next(); // ← FIXED: must call next() at the end

    /*
    const user = this;
    if(!user.isModified(this.password)) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex")

    this.salt = salt;
    this.password = hashedPassword;
    next();
    */
});

userSchema.statics.matchPassword = async function(email, password){
    const user = await this.findOne({email});
    if(!user)
        throw new Error("User not found");
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if(hashedPassword !== userProvidedHash)
        throw new Error("Incorrect Password")
    const token = createTokenForUser(user);
    return token;
}

const User = mongoose.model('User', userSchema);
module.exports = User;

