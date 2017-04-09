var express        = require('express'),
    fs             = require('fs'),
    minifyHTML     = require('express-minify-html')
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
app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
      collapseWhitespace:           true,
      collapseInlineTagWhitespace:  true,
      collapseBooleanAttributes:    true,
      removeComments:               true,
      removeAttributeQuotes:        true,
      removeEmptyAttributes:        true,
      removeStyleLinkTypeAttributes:true,
      minifyURLs:                   false,
      minifyCSS:                    true,
      minifyJS:                     true
  }
}));

app.get('/', function(req,res) {
  res.render('index.ejs', {
    data: allMenuItems,
    domain: req.headers.host
  });
});

menuItems = getContentList();
init(menuItems);

console.log(menuItems);
console.log('listening on port 4000');
app.listen(4000);