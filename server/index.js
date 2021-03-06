var express = require('express'),
    morgan  = require('morgan'),
    st = require('serve-static'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    _ = require('lodash'),
    forum = require('./forum'),
    config = require('./config'),
    util = require('./util'),
    template = require('./template');

var app = express();

if(util.isDev()) {
    app.use(require('enb/lib/server/server-middleware').createMiddleware({
        cdir: process.cwd(),
        noLog: false
    }));
}

var forumOptions = config.get('forum');

app
    .use(st(process.cwd()))
    .use(morgan('default')) //todo remove it after development
    .use(cookieParser()) //also is necessary for forum
    .use(bodyParser()) //also is necessary for forum
    .use(forum('/', forumOptions)) //forum middleware
    .use(function(req, res) {
        return template.run(_.extend({ block: 'page' }, req.__data), req)
            .then(function(html) {
                res.end(html);
            })
            .fail(function(err) {
                res.end(err);
            });
    });

app.listen(3000, function() { console.log('server started on port 3000'); });
