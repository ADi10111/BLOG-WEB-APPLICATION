const { validateToken } = require('../services/authentication');
function checkForAuthenticationCookie(cookieName) {
    return (req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
            return next();
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            //console.log("User Payload from Token:", userPayload);
            req.user = userPayload;
            return next();
        } catch (error) {
           //console.error("Error validating token:", error);
           return next();
        };
    }
}

module.exports = {
    checkForAuthenticationCookie,
};
//This function is used to validate that the cookies in req exist and if they are valid or not