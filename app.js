const express = require("express");

const app = express();


const routes = require("./routes/index")

const port = process.env.PORT || 3000;

app.use("/api/", routes);

app.listen(port, () => {
    console.log(`Listening in port ${port}`);
})