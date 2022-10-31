
const express = require("express");
const appRoutes = require("./Routes/appRoutes");
const cors = require("cors");
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express();
const path = require('path')
const port = 4000;


mongoose.connect("mongodb+srv://gfiles:FmGgEAjwBptr00SZ@cluster0.h54pelo.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
});
mongoose.connection.once("open", () => {
    console.log("Database is connected");
})


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: 10000 }))
app.use(bodyParser.json())
app.use("/Files", express.static(path.join(__dirname, 'Files')));
app.use("/app", appRoutes)


app.listen(port, () => {
    console.log("Server is runing on port ", port)
})