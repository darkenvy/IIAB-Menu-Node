var express    = require('express'),
    fs         = require('fs'),
    bodyParser = require('body-parser'),
    menuItems  = require('./menuItems.module');

var app = express();
var allMenuItems = {};
app.set('view-engine', 'bodyParser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/common', express.static('common'));
app.use('/menu-files', express.static('menu-files'));

// +========================================================================+ //
// |                          Initialization                                | //
// +========================================================================+ //

function init() {
  // Initialize big object of all JSON data for rendering
  menuItems.forEach(function(item) {
    var fileIn = fs.readFileSync('./menu-files/menu-defs/' + item + '.json', 'utf8');
    var obj = {};

    // Some JSONs can have illegal starting chars. This cleans them up
    var illegalChecker = fileIn.toString();
    while (illegalChecker[0] !== '{') { 
      illegalChecker = illegalChecker.slice(1, illegalChecker.length) 
    }
    try { 
      obj = JSON.parse(illegalChecker) 
      allMenuItems[item] = obj;
    } catch (e) { 
      // Uncomment to find missing menu items
      // console.log('Illegal Characters in file: ', item, e) 
    }
  });

}


// +========================================================================+ //
// |                              Routes                                    | //
// +========================================================================+ //

app.get('/', function(req,res) {
  // console.log(Object.keys({data: allMenuItems}.data));
  res.render('index.ejs', {data: allMenuItems});
});

init();
app.listen(3000);