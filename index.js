var express    = require('express'),
    fs         = require('fs'),
    bodyParser = require('body-parser'),
    menuItems  = require('./menuItems.module');

var app = express();
var allMenuItems = {};
app.set('view-engine', 'bodyParser');
app.use(bodyParser.urlencoded({ extended: false }));
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
      allMenuItems[item] = createHref(obj);
    } catch (e) { 
      // Uncomment to find missing menu items
      // console.log('Illegal Characters in file: ', item, e) 
    }

    function createHref(obje) {
      switch (obje['intended_use']) {
        case 'zim':
          obje['href_path'] = obje.zim_name;
          break;
        case 'html':
          obje['href_path'] = 'modules/' + obje.moddir;
          break;
        case 'webroot':
          obje['href_path'] = '/' + obje.moddir;
          break;
        case 'kalite':
          obje['href_path'] = ':8008'
          break;
        case 'osm':
          obje['href_path'] = '/iiab/static/map.html'
          break;
        default:
          obje['href_path'] = '#'
          console.log('');
      }
      return obje;
    }

  });

}


// +========================================================================+ //
// |                              Routes                                    | //
// +========================================================================+ //

app.get('/', function(req,res) {
  // console.log(Object.keys({data: allMenuItems}.data));
  // console.log(req);
  res.render('index.ejs', {
    data: allMenuItems,
    domain: req.headers.host
  });
});

init();
app.listen(4000);