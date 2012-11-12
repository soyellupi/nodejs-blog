var BlogPost = require('../../models/blog_post').BlogPost;

var blogPost = new BlogPost('localhost', 27017);

exports.create = function(req, res) {
    blogPost.addComment(req.params.id, {
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog_posts/' + req.params.id)
       });
};