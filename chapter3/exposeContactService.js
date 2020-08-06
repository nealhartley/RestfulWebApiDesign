const express = require('express')
const http = require('http')
const path = require('path')
const bodyparser = require('body-parser')
const logger = require('morgan')
const methodOverride = require('method-override')
const errorHandler = require('errorhandler')
const mongoose = require('mongoose')
const dataservice = require('./modules/contactdataservice')

const app = express()
const url = require('url')

// All Environments
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(methodOverride())
app.use(bodyparser.json())

// Development only 
if('development' == app.get('env')) {
    app.use(errorHandler())
}

mongoose.connect('mongodb://localhost/contacts')

let contactSchema = new mongoose.Schema({
    primarycontactnumber: {type: String, index: { unique: true }},
    firstname: String,
    lastname: String,
    title: String,
    company: String,
    jobtitle: String,
    othercontactnumbers: [String],
    primaryemailaddress: String,
    emailaddresses: [String],
    groups: [String]
})

const Contact = mongoose.model('Contact', contactSchema)

app.get('/contacts/:number', (request, response) => {
    console.log(request.url + ' : querying for ' + request.params.number)
    dataservice.findByNumber(Contact, request.params.number, response)
})

app.post('/contacts', (request, response) => {
    dataservice.update(Contact, request.body, response)
})

app.put('/contacts', (request, response) => {
    dataservice.create(Contact, request.body, response)
})

app.del('/contacts/:primarycontactnumber', (request, response) => {
    dataservice.remove(Contact, request.params.primarycontactnumber, response)
})

app.get('/contacts', (request, response) => {
    console.log('listing all contacts with ' + request.params.key +  ' = ' + request.params.value)
    dataservice.list(Contact,response)
})

console.log('Running at port ' + app.get('port'))
http.createServer(app).listen(app.get('port'))