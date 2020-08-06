var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var levelUp = require('levelup');

var http = require('http');
var url = require('url');

var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(methodOverride());
app.use(bodyParser.json());

if('development' === app.get('env')){
  app.use(errorHandler());
}

var db = levelUp('./contact', {valueEncoding: 'json'});
db.put("+359777123456",{
  "firstName" : "Joe",
  "lastName" : "Smith",
  "title" : "Mr.",
  "company" : "Dev Inc.",
  "jobTitle" : "Developer",
  "primaryContactNumber" : "+359777123456",
  "otherContactNumbers" : [
      "+359777456789",
      "+359777112233"
  ],
  "primaryEmailAddress" : "joe.smith@xyz.com",
  "emailAddresses" : [
      "j.smith@xyz.com"
  ],
  "groups" : [
      "Dev",
      "Family"
  ]
});


app.get('/contacts/:number', (request, response) => {
  console.log(request.url + ' :querying for ' + Request.params.number);
  db.get(Request.params.number, (error, data) => {
    if(error){
      response.writeHead(404, {
        'content-type' : 'text/plain'
      });
      response.end('Not Found');
      return;
    }
    response.setHeader('content-type', 'application/json');
    response.send(data)
  });;
});

console.log('Running at port: ' + app.get('port'));


http.createServer(app).listen(app.get('port'));
