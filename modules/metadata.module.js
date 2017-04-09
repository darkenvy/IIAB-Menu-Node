var fs         = require('fs'),
    xmlParse   = require('xml2js').parseString;

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
  var enabledMetadata = [];

  // --- Modules (html) --- //
  modules.forEach(function(folder) {
    var folderWithExt = folder + '.json';
    enabledMetadata.push(folderWithExt);
    if (jsonMetadataList.indexOf(folderWithExt) === -1) {
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
        enabledMetadata.push(zimPathWithExt);
        if (jsonMetadataList.indexOf(zimPathWithExt) === -1) {
          console.log('create json2: ', zimPathWithExt);
          var longDescription = `${zimList[zim]['$'].description}. Made by ${zimList[zim]['$'].creator} ${zimList[zim]['$'].publisher}. ${zimList[zim]['$'].articleCount} Articles`
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
    enabledMetadata.push('usb.json');
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
    enabledMetadata.push('kalite.json');
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
    enabledMetadata.push('osm.json');
    createMetadata({
      intended_use: 'osm',
      moddir: 'osm',
      logo_url: 'osm.jpg',
      menu_item_name: 'open_street_maps',
      title: 'Open Street Maps',
      description: 'Internet-in-a-box OpenStreetMaps'
    });
  }

  return enabledMetadata;
}

module.exports = metadata;