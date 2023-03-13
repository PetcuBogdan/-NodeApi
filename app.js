const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { request } = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", () => {
  console.log("connected");
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticle) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticle);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("New article added");
      }
    });
  });

// app.delete("/articles", function (req, res) {
//   Article.find(function (err) {
//     if (!err) {
//       res.send("deleted with succes");
//     } else {
//       res.send(err);
//     }
//   });
// });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    const title = req.params.articleTitle;
    Article.findOne({ title: title }, function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send("Succes " + result);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Succes ");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ titile: req.params.articleTitle }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Succes ");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
