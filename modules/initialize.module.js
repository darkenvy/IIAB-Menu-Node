var fs = require('fs');

// +========================================================================+ //
// |                          Initialization                                | //
// +========================================================================+ //

// Initialization takes place after metadata.module (where metadata is checked/created)
// This step loads all the JSON files for all used modules (and only used modules) into RAM

function init(items) {
  var allMenuItems = {}
  items.forEach(function(item) {
    var fileIn = fs.readFileSync('./metadata/' + item, 'utf8');
    var obj = {};

    // Some JSONs can have illegal starting chars. This cleans them up. Find the cause of this. This shouldn't be a problem.
    var illegalChecker = fileIn.toString();
    while (illegalChecker[0] !== '{') {
      if (illegalChecker.length <= 1) break;
      illegalChecker = illegalChecker.slice(1, illegalChecker.length);
    }
    try {allMenuItems[item] = createHref(JSON.parse(illegalChecker))} 
    catch (e) {console.log(e)}
  });

  return allMenuItems;
}

function createHref(obje) {
  switch (obje['intended_use']) {
    case 'zim':
      obje['href_path'] = ':3000/' + obje.moddir + '/?';
    break;
    case 'html':
      obje['href_path'] = ':81/modules/' + obje.moddir;
    break;
    case 'webroot':
      obje['href_path'] = ':81/' + obje.moddir;
    break;
    case 'kalite':
      obje['href_path'] = ':8008/';
    break;
    case 'osm':
      obje['href_path'] = ':81/iiab/static/map.html';
    break;
    default:
      obje['href_path'] = ':81/local_content/';
  }
  return obje;
}

module.exports = init;