const express = require('express')
const http = require('http')
const path = require('path')
const bodyparser = require('body-parser')
const logger = require('morgan')
const methodOverride = require('method-override')
const errorHandler = require('errorhandler')
const mongoose = require('mongoose')
const dataservice_v1 = require('./modules/contactdataservice_1')
const dataservice_v2 = require('./modules/contactdataservice_2')

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

app.get('/v1/contacts/:number', (request, response) => {
    console.log(request.url + ' : querying for ' + request.params.number)
    dataservice_v1.findByNumber(Contact, request.params.number, response)
})

app.post('/v1/contacts', (request, response) => {
    dataservice_v1.update(Contact, request.body, response)
})

app.put('/v1/contacts', (request, response) => {
    dataservice_v1.create(Contact, request.body, response)
})

app.del('/v1/contacts/:primarycontactnumber', (request, response) => {
    dataservice_v1.remove(Contact, request.params.primarycontactnumber, response)
})

app.get('/v1/contacts', (request, response) => {
    console.log('listing all contacts with ' + request.params.key +  ' = ' + request.params.value)
    dataservice_v1.list(Contact,response)
})

app.get('/contacts', function(request, response){
    const get_params = url.parse(request.url, true).query
    
    if(Object.keys(get_params).length == 0){
        dataservice_v2.list(Contact, response)
    }

    else {
        const key = Object.keys(get_params)[0]
        const value = get_params[key]
        JSON.stringify(dataservice_v2.query_by_arg(Contact, key, value, response))
    }
})

console.log('Running at port ' + app.get('port'))
http.createServer(app).listen(app.get('port'))