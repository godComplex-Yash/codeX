const JWT = require("jsonwebtoken"); 
const secret = "LaxmiPragIshita@14"; // this is hardcoded just for temporary and will have a encrypted value once the whole project is ready for production grade

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
        fullName: user.fullName
    };
    const token = JWT.sign(payload, secret);
    return token;
}

// validate token ek function hai jahpe hum jo bhi token banaye hai wou validate karenge apne secret key ke help se
function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}  

module.exports = {
    createTokenForUser,
    validateToken,
};