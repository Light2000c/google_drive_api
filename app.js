const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


const routes = require("./routes/index");

app.use(cors({
    origin: '*',
}));

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT || 3000;

app.use("/api/", routes);

app.listen(port, () => {
    console.log(`Listening in port ${port}`);
})