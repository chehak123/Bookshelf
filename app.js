const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash")
const mongoose=require("mongoose");

//mongoose connect
mongoose.connect("mongodb+srv://chehak:123@cluster0.ohkb1.mongodb.net/commentDB" , {
  useNewUrlParser : true, 
  useUnifiedTopology: true 
} );

//schema
const postSchema = {
  title: String,
  body: String,
  author:String,
  genre: String,
  image:String,
  summary:String,
  bookmark:Number
};

//model
const Post = mongoose.model("Post", postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


// var posts=[];                  //made an array to hold all the posts

app.get("/", function(req, res) {
  Post.find({}, function(err, posts){

    res.render("home", { 
      posts: posts
      });
 
  })
  });

  app.get("/compose", function(req, res) {
    res.render("compose", {});
  });

  app.post("/compose",function(req,res){      // post req for compose page as we have apost form in that page

    const post_in_db = new Post({
      title: req.body.posttitle,
      body: req.body.posttext,
      author:req.body.postauthor,
      genre:req.body.postgenre,
      image:req.body.postimage,
      summary:req.body.summary,
      bookmark:0
    });

    post_in_db.save();

    // posts.push(post);                   // pushed the post object created to posts array
    res.redirect("/");                    // redirecting to home page after publishing

  });


  app.get("/posts/:topic",function(req,res){
    //  console.log(req.params.topic);/

    // console.log(req.params.topic +"00000000000000");
    var x=req.params.topic;
    Post.find({}, function(err, posts){
      posts.forEach(function(post){

        const pagetitle= post._id;         //using lodash 
  // console.log(req.params.topic);
  // console.log(pagetitle);
        if(x==pagetitle){
          console.log("xyz");
          res.render("post", {
            posttitle:post.title,
            postbookmark:post.bookmark,
            postcontent:post.body,
            postauthor:post.author,
            postgenre:post.genre,
            postid:post._id
            // console.log(postid);
          });
        }
       })
   
    })

  });

  app.post("/posts/:topic",function(req,res){
     console.log(req.params.topic);

    var id=req.params.topic;
    
    Post.find({}, function(err, posts){
      posts.forEach(function(post){

        const pagetitle= post._id;         //using lodash 
  
        if(req.params.topic==pagetitle){
          if(post.bookmark==0){
            console.log("a");
            post.bookmark=1;
            post.save();
          }else{
            console.log("b");
            post.bookmark=0;
            post.save();
          }

          res.render("post", {
            posttitle:post.title,
            postcontent:post.body,
            postid:post._id,
            postgenre:post.genre,
            postauthor:post.author,
            postbookmark:post.bookmark
          });
        }
       })
   
    })

  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});