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
    // var fileIn = fs.readFileSync('./menu-files/menu-defs/' + item + '.json', 'utf8');
    var fileIn = fs.readFileSync('./metadata/' + item, 'utf8');
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

// Obtain a list of all json files on startup.
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
  // Check to see if premade metadata exists. If not, we call createMetadata to make it.
  
  // --- Modules (html) --- //
  modules.forEach(function(folder) {
    var folderWithExt = folder + '.json';
    if (jsonMetadataList.indexOf(folderWithExt) === -1) {
      jsonMetadataList.push(folderWithExt);
      console.log('create json ', folderWithExt)
      createMetadata({
        intended_use: 'html',
        moddir: folder,
        logo_url: 'content.jpg',
        menu_item_name: folder,
        title: folder.replace(/\W/g, ' ') // replace symbols with spaces
      });
    }
  });

  // --- Zims --- //
  xmlParse(zims, {trim: true, normalize: true, firstCharLowerCase: true}, function(err, data) {
    if (data && data.library && data.library.book) {
      var zimList = data.library.book;
      for (var zim in zimList) {
        var zimPath = zimList[zim]['$'].path.match(/\/(.+?)\.zim/)[1];
        var zimPathWithExt = zimPath + '.json';
        if (jsonMetadataList.indexOf(zimPathWithExt) === -1) {
          console.log('create json2: ', zimPathWithExt);
          var longDescription = `${zimList[zim]['$'].description}. Made by ${zimList[zim]['$'].creator} ${zimList[zim]['$'].publisher}. ${zimList[zim]['$'].articleCount} Articles`
          jsonMetadataList.push(zimPathWithExt);
          createMetadata({
            intended_use: 'zim',
            moddir: zimPath,
            logo_url: 'wikipedia.png',
            menu_item_name: zimPath,
            title: zimList[zim]['$'].title,
            lang: zimList[zim]['$'].language || null,
            description: longDescription || zimList[zim]['$'].description || ''
          });
        }
      }
    }
  });

  // --- Webroot --- //
  if (jsonMetadataList.indexOf('usb.json') === -1) {
    console.log('create json5: ', 'usb.json');
    jsonMetadataList.push('usb.json');
    createMetadata({
      intended_use: 'usb',
      moddir: 'usb',
      logo_url: 'en-file_share.png',
      menu_item_name: 'usb_material',
      title: 'USB Materoa;',
      description: 'Additional materials'
    });
  }


  // --- KALite --- //
  if (jsonMetadataList.indexOf('kalite.json') === -1) {
    console.log('create json3: ', 'kalite.json');
    jsonMetadataList.push('kalite.json');
    createMetadata({
      intended_use: 'kalite',
      moddir: 'kalite',
      logo_url: 'kaos.png',
      menu_item_name: 'kalite',
      title: 'Khan Academy',
      description: 'Videos on math and science'
    });
  }

  // --- OSM --- //
  if (jsonMetadataList.indexOf('osm.json') === -1) {
    console.log('create json4: ', 'osm.json');
    jsonMetadataList.push('osm.json');
    createMetadata({
      intended_use: 'osm',
      moddir: 'osm',
      logo_url: 'osm.jpg',
      menu_item_name: 'open_street_maps',
      title: 'Open Street Maps',
      description: 'Internet-in-a-box OpenStreetMaps'
    });
  }


}

function getContent() {
  var osm     = true,
      webroot = true,
      kalite  = true,
      modules = fs.readdirSync('/library/www/html/modules/'),
      zims = fs.readFileSync('/library/zims/library.xml', 'utf8'),
      removeMenuItem = function(item) {
        var itemIdx = jsonMetadataList.indexOf(item);
        if (itemIdx !== -1) jsonMetadataList.splice(itemIdx, 1);
      };
  
  // Check the lists of content that we just aquired. Ensures that JSONs exists for each content pack
  metadata(modules, zims, osm, webroot, kalite);
  
  // Remove items if they are specified to not be in the instance (activated)
  if (!osm)     removeMenuItem('osm.json');
  if (!webroot) removeMenuItem('usb.json');
  if (!kalite)  removeMenuItem('kalite.json');
  return jsonMetadataList;
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