var express        = require('express'),
    fs             = require('fs'),
    getContentList = require('./modules/getcontent.module'),
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
// Removing Apache from port 80 (so that node can bind to it) makes us lose
// the 'html'-hosted modules. We must bind Apache to another port and host them there
// Port 81 looks unused: http://www.networksorcery.com/enp/protocol/ip/ports00000.htm
// app.use('/modules', express.static('/library/www/html/modules/'));

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