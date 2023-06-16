const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", { useNewUrlParser : true});

const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////Requests targeting all routes////////////////////////////

app.route("/articles")
  .get(async (req, res) => {
    const foundArticles = await Article.find({});
    res.send(foundArticles);
  })
  .post(async (req, res) => {
    const article = await Article.create({
      title: req.body.title, content: req.body.content });
    res.send(article);
  })
  .delete(async (req, res) => {
    await Article.deleteMany({});
    res.send("Successfully deleted all articles!");
  });


  ///////////////////Requests targetting a single route///////////////////////
  app.route("/articles/:articleTitle")
  .get(async (req, res) => {
    try {
      const foundArticle = await Article.findOne({ title: req.params.articleTitle });
      res.send(foundArticle);
    } catch (err) {
      res.status(404).json({ error: "Article not found -->: " + err });
    }
  })
 
  .put(async (req, res) => {
    try {
      const updatedArticle = await Article.replaceOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content });
        console.log(`Modified ${updatedArticle.modifiedCount} document`);
        res.status(200).send(updatedArticle);
    } catch (err) {
      res.status(500).json({ error: "Modification failed -->: " + err })
    }
  });
 

app.listen(3000, function(){
    console.log("Server started on port 3000");
});