var BlogPost = require('../models/blog_post').BlogPost;

var blogPost = new BlogPost('localhost', 27017);

exports.index = function(req, res){
    blogPost.findAll( function(error,docs){
        res.render('blog_posts/index.jade', {
            title: 'Blog',
            blog_posts:docs
        });
    })
};

exports.new = function(req, res) {
    res.render('blog_posts/new.jade', {
        title: 'New Post'
    });
};

exports.create = function(req, res){
    blogPost.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
};

exports.show = function(req, res) {
    blogPost.findById(req.params.id, function(error, blog_post) {
        res.render('blog_posts/show.jade',
        {
            title: blog_post.title,
            blog_post: blog_post
        });
    });
};