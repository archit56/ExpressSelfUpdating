// mongodb connectivity
require("dotenv").config();
// console.log(process.env);
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

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

app.post("/delete", async (req, res) => {
    const checkboxId = req.body.checkbox;
    console.log(checkboxId)

    listModel.deleteOne({ _id: checkboxId }).then((e) => {console.log(e)});
    await res.redirect("/")
})

app.post("/update", (req, res) => {

    const checkbox2Id = req.body.checkbox2;
    console.log(checkbox2Id);

    const toDolist = listModel.find({_id: checkbox2Id}).then((member => {
        console.log("This is the member" + member)
        res.render("update", { itemsObj: member });
    }));

    
    // listModel.updateOne({_id: checkbox2Id}).then()
})

app.post("/finalUpdate", async (req, res) => {
    const newItem = req.body.nextItem;
    const newDesc = req.body.desc;
    const newImage = req.body.image;
    const objectId = req.body.objectId;

    console.log(req.body);
    console.log(objectId);

    listModel.updateOne({_id: objectId}, {$set: {name: newItem, desc: newDesc, image: newImage}}).then((e) => console.log(e));

    await res.redirect("/")
})


app.get("/about", (req, res) => {
    res.render("about");
})


app.listen(port, () => {
    console.log("Server runnin at localhost:3000");
})