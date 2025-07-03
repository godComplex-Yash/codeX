const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
// hum yaha pe manually port no nahi de sakte cause jab hum isko deploy karte hai cloud services pe toh 
// waha pe ye ek dynamic value hai jisko hum env variables ko use karke handle karte hai... 

const PORT = 8082;

mongoose.connect('mongodb://localhost:27017/blogX').then((e) => console.log("mongoDB connected succesfully"))

app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(express.json());
app.get("/", (req, res) => {
    res.render("home", {
        user: req.user,
    });  
});
app.use("/user", userRoute);
app.listen(PORT, () =>{
    console.log(`Server is running live on http://localhost:${PORT}`);
});



