const express = require("express");
const bodyParser = require("body-parser");
const { pool } = require("./config/db.config.js");
const cors = require("cors");
const csurf = require('csurf');
const session = require("express-session"); 
const pgSession = require("connect-pg-simple")(session);
require("dotenv").config();

const app = express();
const port = process.env.PORT;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const userRoutes = require("./routes/user_routes.js");
const dataRoutes = require("./routes/data_routes.js");
const chartRoutes = require("./routes/chart_routes.js");

/*app.use(
    session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 3600000 } // 1 jam
}));*/

app.use(
    session({
        store: new pgSession({
            pool,
            tableName: "session",
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Ubah ke true jika pakai HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 1 hari
        }
    })
);






app.use("/user", userRoutes);
app.use("/data", dataRoutes);
app.use("/chart", chartRoutes);

app.get("/debug-session", (req, res) => {
    console.log("Current session:", req.session);
    res.json(req.session);
});

pool.connect(() => {    
    console.log("Connected to database");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});