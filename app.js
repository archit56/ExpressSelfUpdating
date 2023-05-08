// mongodb connectivity
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://archit:test123@startingcluster.wefgydk.mongodb.net/ExpressSelfUpdating');

const listSchema = new mongoose.Schema({
    name: {
        type: String
    },
    desc: {
        type: String
    },
    image: {
        type: String
    }
})

const listModel = new mongoose.model("item", listSchema);

// console.log(getDateDay)

const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
const ejs = require("ejs");
app.set('view engine', 'ejs');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
// app start

app.get("/", (req, res) => {
    // res.write("Hello there");
    // let people = ['geddy', 'neil', 'alex'];
    // let html = ejs.render('<%= people.join(", "); %>', {people: people});

    const toDolist = listModel.find({}).then((members => {
        res.render("index", { toDoList: members });
    }));
})

app.post("/", (req, res) => {
    const newItem = req.body.nextItem;
    const newDesc = req.body.desc;
    const newImage = req.body.image;
    // console.log(newItem)

    // code to add to mongodb database
    const newEntry = new listModel({
        name: newItem,
        desc: newDesc,
        image: newImage
    })

    newEntry.save().then(res.redirect("/"));

})

app.post("/delete", (req, res) => {
    const checkboxId = req.body.checkbox;
    console.log(checkboxId)

    listModel.deleteOne({ _id: checkboxId }).then(res.redirect("/"));


})

app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(port, () => {
    console.log("Server runnin at localhost:3000");
})