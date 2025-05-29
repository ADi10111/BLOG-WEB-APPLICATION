const JWT = require("jsonwebtoken");

//Name such that noone can predict
const secret = "$uperMan@123";

//Create Token for user
function createTokenForUser(user) {
    const payload = {
        fullName: user.fullName,
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    //JWT creates token of payload with secret key for authentication
    const token = JWT.sign(payload, secret);
    return token;
}
//The  function verifies the provided JWT using the secret key to ensure its authenticity and extracts the embedded data (payload) if valid. It returns the payload, which contains user details, or throws an error if the token is invalid.
function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
};