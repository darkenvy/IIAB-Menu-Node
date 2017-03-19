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
    // Find the cause of this. This shouldn't be a problem.
    var illegalChecker = fileIn.toString();
    while (illegalChecker[0] !== '{') { 
      illegalChecker = illegalChecker.slice(1, illegalChecker.length) 
    }

    try { 
      obj = JSON.parse(illegalChecker);
      // if (obj.hasOwnProperty('extra_html') && obj['extra_html'] !== '') {
      //   obj = getExtraHtml(obj);
      // }
      allMenuItems[item] = createHref(obj);
    } catch (e) {
      // console.log('Illegal Characters in file: ', item, e)
    }

    // function getExtraHtml(obje) {
    //   var xtra = fs.readFileSync('./menu-files/menu-defs/' + obje['extra_html'], 'utf8');
    //   obje['extra_html_file'] = xtra;
    //   return obje;
    // }

    function createHref(obje) {
      switch (obje['intended_use']) {
        case 'zim':
          obje['href_path'] = ':3000/' + obje.zim_name;
          break;
        case 'html':
          obje['href_path'] = '/modules/' + obje.moddir;
          break;
        case 'webroot':
          obje['href_path'] = '/' + obje.moddir;
          break;
        case 'kalite':
          obje['href_path'] = ':8008/'
          break;
        case 'osm':
          obje['href_path'] = '/iiab/static/map.html'
          break;
        default:
          obje['href_path'] = '/#'
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
console.log('listening on port 4000');
app.listen(4000);