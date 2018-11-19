var express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  mongoose = require("mongoose"),
  app = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  Created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTE

app.get("/", function(req, res) {
  res.redirect("/blogs");
});

// INDEX ROUTE

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERR");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res) {
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      //then, redirect to the index page
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE

app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, blog) {
    if (err) {
      res.redirect("/");
    } else {
      res.render("show", { blog: blog });
    }
  });
});

//EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    foundBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE ROUTE

app.delete("/blogs/:id", function(req, res) {
  //DESTROY BLOG
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

// app.get("/blogs/:id", function(req, res) {
//   Blog.findById(req.params.id, function(err, foundBlog) {
//     if (err) {
//       res.redirect("/blogs");
//     } else {
//       res.render("show", { blog: foundBlog });
//     }
//   });
// });

app.listen(1010, "localhost", function() {
  console.log("Blog Server launched");
});

// LOAD UP MONGOD
// "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\data\db"

//and the MONGO
// "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"

//then fire on
