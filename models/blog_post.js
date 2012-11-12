var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

BlogPost = function(host, port) {
  this.db= new Db('nodejs-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


BlogPost.prototype.getCollection= function(callback) {
  this.db.collection('blog_posts', function(error, blog_posts) {
    if( error ) callback(error);
    else callback(null, blog_posts);
  });
};

BlogPost.prototype.findAll = function(callback) {
    this.getCollection(function(error, blog_posts) {
      if( error ) callback(error)
      else {
        blog_posts.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


BlogPost.prototype.findById = function(id, callback) {
    this.getCollection(function(error, blog_posts) {
      if( error ) callback(error)
      else {
        blog_posts.findOne({_id: blog_posts.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

BlogPost.prototype.save = function(existent_blog_posts, callback) {
    this.getCollection(function(error, blog_posts) {
      if( error ) callback(error)
      else {
        if( typeof(existent_blog_posts.length)=="undefined")
          existent_blog_posts = [existent_blog_posts];

        for( var i =0;i< existent_blog_posts.length;i++ ) {
          blog_post = existent_blog_posts[i];
          blog_post.created_at = new Date();
          if( blog_post.comments === undefined ) blog_post.comments = [];
          for(var j =0;j< blog_post.comments.length; j++) {
            blog_post.comments[j].created_at = new Date();
          }
        }

        blog_posts.insert(existent_blog_posts, function() {
          callback(null, existent_blog_posts);
        });
      }
    });
};

BlogPost.prototype.addComment = function(blogPostId, comment, callback) {
  this.getCollection(function(error, blog_posts) {
    if( error ) callback( error );
    else {
      blog_posts.update(
        {_id: blog_posts.db.bson_serializer.ObjectID.createFromHexString(blogPostId)},
        {"$push": {comments: comment}},
        function(error, blog_post){
          if( error ) callback(error);
          else callback(null, blog_post)
        });
    }
  });
};

exports.BlogPost = BlogPost;