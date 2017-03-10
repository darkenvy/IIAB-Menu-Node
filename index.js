var express    = require('express'),
    fs         = require('fs'),
    bodyParser = require('body-parser');

var app = express();
app.set('view-engine', 'bodyParser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/common', express.static('common'));
app.use('/menu-files', express.static('menu-files'));

app.get('/', function(req,res) {
  res.render('index.ejs');
});

app.listen(3000);