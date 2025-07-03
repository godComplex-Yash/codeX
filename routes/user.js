const { Router } = require("express");
const User = require('../models/user')
const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});
router.get("/signup", (req, res) => {
    return res.render("signup");
});
router.get("/dashboard", (req, res) => {
    if(!req.user){
        return res.redirect("user/signin");
    }
    return res.render("dashboard", {
        user: req.user,
    });
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.redirect("signin");
});


router.post("/signin", async(req, res) => {
    const {email, password} = req.body;
    try {
        const token = await User.matchPassword(email, password);
        return res.cookie("token", token).redirect("/user/dashboard");
    } catch(error){
        return res.render("signin", {
            error : "Incorrect email or password",
        });
    }   
});

router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log("Received data:", req.body);

        const newUser = await User.create({ fullName, email, password });
        console.log("User created:", newUser);

        return res.redirect("/");
    } catch (err) {
        console.error("Signup Error:", err); // ← print full error
        return res.status(500).send("Signup failed. Try again.");
    }
})
module.exports = router;