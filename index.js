var express        = require('express'),
    fs             = require('fs'),
    getContentList = require('./modules/content.module'),
    init           = require('./modules/initialize.module'),
    app            = express(),
    allMenuItems   = {};

// var bodyParser = require('body-parser');
// app.set('view-engine', 'bodyParser');
// app.use(bodyParser.urlencoded({ extended: false }));

// +========================================================================+ //
// |                              Routes                                    | //
// +========================================================================+ //

app.use('/public', express.static('views/public'));

app.get('/', function(req,res) {
  res.render('index.ejs', {
    data: allMenuItems,
    domain: req.headers.host
  });
});

menuItems    = getContentList();
allMenuItems = init(menuItems);

console.log(menuItems);
console.log('listening on port 4000');
app.listen(4000);