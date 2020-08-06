var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')

var contacts = require('./modules/contacts');

var http = require('http');
var url = require('url');


var app = express();

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

app.get('/contacts',
          (request, response) => {
            var get_params = url.parse(request.url, true).query;
            if(Object.keys(get_params).length === 0){
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify(contacts.list()));
            }
            else{
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify(contacts.query_by_arg(get_params.arg, get_params.value)));
            }
          }
);

app.get('/contacts/:number', (request, response) => {
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(contacts.query(request.params.number)));
});

app.get('/groups', (request, response) => {
  console.log('groups');
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(contacts.list_groups()));
});

app.get('/groups/:name', (request, response) => {
  console.log('groups');
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(contacts.get_members(request.params.name)));
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000 maahn');
});
