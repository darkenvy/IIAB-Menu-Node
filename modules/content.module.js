var fs         = require('fs'),
    metadata   = require('./metadata.module');

// +========================================================================+ //
// |                         Find Content Packs                             | //
// +========================================================================+ //

function getContentList() {
  var osm     = true,
      webroot = true,
      kalite  = true,
      modules = fs.readdirSync('/library/www/html/modules/'),
      zims = fs.readFileSync('/library/zims/library.xml', 'utf8'),
      removeMenuItem = function(item) {
        var itemIdx = enabledMetadata.indexOf(item);
        if (itemIdx !== -1) enabledMetadata.splice(itemIdx, 1);
      };
  
  // Check the lists of content that we just aquired. Ensures that JSONs exists for each content pack
  var enabledMetadata = metadata(modules, zims, osm, webroot, kalite);
  
  // Remove items if they are specified to not be in the instance (activated)
  if (!osm)     removeMenuItem('osm.json');
  if (!webroot) removeMenuItem('usb.json');
  if (!kalite)  removeMenuItem('kalite.json');
  return enabledMetadata;
}

module.exports = getContentList;