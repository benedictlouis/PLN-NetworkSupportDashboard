const express = require("express");
const bodyParser = require("body-parser");
const { pool } = require("./config/db.config.js");
const cors = require("cors");


const app = express();
const port = process.env.PORT;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const userRoutes = require("./routes/user_routes.js");
const dataRoutes = require("./routes/data_routes.js");
const chartRoutes = require("./routes/chart_routes.js");


app.use("/user", userRoutes);
app.use("/data", dataRoutes);
app.use("/chart", chartRoutes);


pool.connect(() => {    
    console.log("Connected to database");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});