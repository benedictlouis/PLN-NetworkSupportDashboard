const express = require("express");
const bodyParser = require("body-parser");
const { pool } = require("./config/db.config.js");
const cors = require("cors");


const app = express();
const port = process.env.PORT;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


pool.connect(() => {
    console.log("Connected to database");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});