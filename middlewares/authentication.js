const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        // If no token, skip user and move on
        if (!tokenCookieValue) {
            return next();  // ✅ RETURN here!
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            // Invalid token — treat as not logged in
            return next();  // ✅ RETURN here too!
        }

        next();  // If token was valid
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
