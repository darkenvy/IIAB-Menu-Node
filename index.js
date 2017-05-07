/* globals menuItems: true */ // Used by JSHint's Linter
/* 
  # --- What is What --- #
  getContentList is a module that searches for zims, osm, 
  static resources and the like. When getContentList returns,
  we have an array in the format like so: ['usb.json', 'kalite.json', 'osm.json'].

  initialize is a module that takes in a list of content (from 
  getContentList) and loads the json for that module. The data
  returned is an array of objects (the json files instantiated in
  javascript)

  allMenuItems is the data returned from getContentList. This is
  passed into the templating engine after the '/' route is hit.

  req.headers.host gets the route the user hit to view the page.
  This way, http://box, 192.168.2.3, or localhost is filled out
  and rendered appropriately when links need to be dynamic.

  # --- Notes on port 80 --- #
  Removing Apache from port 80 (so that node can bind to it) makes us lose
  the 'html'-hosted modules. We must bind Apache to another port and host them there
  Port 81 looks unused: http://www.networksorcery.com/enp/protocol/ip/ports00000.htm
*/

// +========================================================================+ //
// |                              Modules                                   | //
// +========================================================================+ //
var express        = require('express'),
    getContentList = require('./modules/getcontent.module'),
    init           = require('./modules/initialize.module'),
    app            = express(),
    allMenuItems   = {};

// +========================================================================+ //
// |                              Routes                                    | //
// +========================================================================+ //

app.use('/public', express.static('views/public'));

app.get('/', function(req,res) {
  res.render('index.ejs', {
    data: allMenuItems,
    domain: req.headers.host
  });
});

// +========================================================================+ //
// |                            Startup / Main                              | //
// +========================================================================+ //
// When not developing on a pi, disable the next line. and enable the following
menuItems = ['usb.json', 'kalite.json', 'osm.json']; // used when not on pi
// menuItems    = getContentList(); // used when on pi
allMenuItems = init(menuItems);

// When on a pi, change port 4000 to port 80.
console.log(menuItems); // Shows all loaded content packs on bootup
console.log('listening on port 4000');
app.listen(4000); // needed to bind the port and keep it bound