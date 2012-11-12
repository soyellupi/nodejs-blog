
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , blog_post = require('./routes/blog_post')
  , comment = require('./routes/blog_post/comment')
  , http = require('http')
  , path = require('path')
  , BlogPost = require('./models/blog_post').BlogPost;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var blogPost = new BlogPost('localhost', 27017);

app.get('/', blog_post.index);

app.get('/blog_posts/new', blog_post.new);

app.post('/blog_posts', blog_post.create);

app.get('/blog_posts/:id', blog_post.show);

app.post('/blog_posts/:id/comments', comment.create);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
