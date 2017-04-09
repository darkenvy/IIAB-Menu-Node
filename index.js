var express    = require('express'),
    fs         = require('fs'),
    bodyParser = require('body-parser'),
    xmlParse   = require('xml2js').parseString,
    // menuItems  = require('./menuItems.module');
    menuItems  = [];

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
    while (illegalChecker[0] !== '{') illegalChecker = illegalChecker.slice(1, illegalChecker.length);

    try { 
      obj = JSON.parse(illegalChecker);
      allMenuItems[item] = createHref(obj);
    } catch (e) {}

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
// |                         Find Content Packs                             | //
// +========================================================================+ //

var jsonMetadataList = (function(){
  return fs.readdirSync('./metadata').filter(function(each) {
    return /\.json/.test(each); // Only return .json files
  });
})();

function createMetadata(jsonObject) {
  if (!jsonObject['moddir']) return;
  var obj = {
    "intended_use" :   jsonObject['intended_use'],
    "moddir" :         jsonObject['moddir'],
    "description" :    jsonObject['description']    || '',
    "lang" :           jsonObject['lang']           || 'en',
    "logo_url" :       jsonObject['logo_url']       || 'content.jpg',
    "menu_item_name" : jsonObject['menu_item_name'] || jsonObject['moddir'],
    "title" :          jsonObject['title']          || jsonObject['moddir']
  }
  fs.writeFile('./metadata/' + obj.moddir + '.json', JSON.stringify(obj), function(e) {
    if (e) console.log('error writing metadata: ', e);
  });
}

function metadata(modules, zims, osm, webroot, kalite) {
  // Check to see if premade metadata exists. If not, we make it.
  // If we have metadata already (zims have some), we override that with the json data
  // we assume the json has the most important data. As it takes more effort to have one created.
  // So... we create metadata for zims.
  modules.forEach(function() {

  })

  // if (jsonMetadataList.indexOf(moduleName) === -1) createMetadata();
}

// Primary function that looks for content. Doesn't look for JSON metadata made by IIAB
function getContent() {
  // Looko for content in all places.
  // If found, check if we have a menu-def json
  // problem is, we may not. So a generic template will have to be made form metadata
  // html = rachel
  // webroot = 
  // kalite = :8008
  // osm = /iiab/static/map.html
  // zim = :3000

  // zims may need to be defined last as the async func is used.
  // zim meta-data from library-xml:
  // book id, path, indexPath, indexType, title, description, language, creator, publisher, faviconMimeType, date, articleCount, mediaCount, size
  var modules = fs.readdirSync('/library/www/html/modules/');
  var osm     = true;
  var webroot = true;
  var kalite  = true;
  var zims = fs.readFileSync('/library/zims/library.xml', 'utf8');
  // xmlParse(zims, {trim: true, normalize: true, firstCharLowerCase: true}, function(err, data) {
  //   console.log(Object.keys(data.library.book))
  //   if (data && data.library && data.library.book) {
  //     var zimList = data.library.book;
  //     for (var zim in zimList) {
  //       console.log(zimList[zim]['$'].title)
  //     } 
  //   }
  // });

  metadata(modules, osm, webroot, kalite, zims);



  return ["en-afristory"];
}

// +========================================================================+ //
// |                              Routes                                    | //
// +========================================================================+ //

app.get('/', function(req,res) {
  res.render('index.ejs', {
    data: allMenuItems,
    domain: req.headers.host
  });
});

menuItems = getContent();
init();
console.log('listening on port 4000');
app.listen(4000);