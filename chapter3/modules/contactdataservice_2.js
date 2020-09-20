// export the function remove() which will remove a contact
// In: datamodel, primarynumber, response object

const { response } = require("express")

// out: nothing => sends reponse object with response data, from within function. 
exports.remove = (model, _primarycontactnumber, response) => {

    console.log(`Deleting contact with primary contact number: ${_primarycontactnumber}`)
    
    // Use model to find one with findOne() function
    model.findOne({primarycontactnumber : _primarycontactnumber}, (error, data) => {
        if(error){
            console.log(error)

            if(response != null) {
                response.writeHead(500, {'Content-Type' : 'text/plain'})
                response.end('Internal Server Error')
            }

            return

        } else {
            if(!data){
                console.log('not found')
                
                if(response != null) {
                response.writeHead(500, {'Content-Type' : 'text/plain'})
                response.end('Internal Server Error')
                }

                return

            } else {
                data.remove((error) => {
                    if(!error) { data.remove() }  //removed
                    else { console.log(error) }  //failed
                })

                if(response != null){
                    response.send('Deleted')
                }
                return
            }
        }
    })
}


// exports update() function
// In dataModel, requestBody, response object
exports.update = (model, requestBody, response) => {
    const primarynumber = requestBody.primarycontactnumber
    //check to see if the number already exists in the db
    model.findOne({primarycontactnumber: primarynumber}, (error, data) => {
        if(error) {
            console.log(error)

            if(response != null) {
                response.writeHead(500, {'Content-Type' : 'text/plain'})
                response.end('Internal Server Error')
            }

            return
            
        } else {
            const contact = toContact(requestBody, model) // create a model 

            if(!data){ // if the object does not exist in the db we push the contact
                console.log(`Contact with primary number: ${primarynumber} does not exist, will create`)
                contact.save((error) => {
                    if(!error){
                        contact.save()
                    }
                })

                if(response != null){
                    response.writeHead(201, {'Content-Type' : 'text/plain'})
                    response.end('Created')
                }

                return // we have created the contact we can now return to end
            }

            // If we make it here the contact existed in the db. 
            // We now update the existing record with the wanted values 
            // Populate the data object with updated values
            data.firstname = contact.firstname
            data.lastname = contact.lastname
            data.title = contact.title
            data.company = contact.company
            data.jobtitle = contact.jobtitle
            data.primarycontactnumber = contact.primarycontactnumber
            data.othercontactnumbers = contact.othercontactnumbers
            data.emailaddresses = contact.emailaddresses
            data.primaryemailaddress = contact.primaryemailaddress
            data.groups = contact.groups

            // Now save updated data item
            data.save((error) => {
                if(!error){
                    console.log(`succesfully updated contact with primarynumber: ${primarynumber}`)
                    data.save()
                } else {
                    console.log('error on save')
                }
            })

            if(response != null){
                response.send('updated')
            }
        }
    })
}

// Creates and adds a contact to the db
exports.create = (model, requestBody, response) => {
    let contact = toContact(requestBody, model)
    const primarynumber = requestBody.primarycontactnumber

    contact.save((error) => {
        if(!error){
            contact.save()
        } else {
            console.log('Checking if contact saving failed due to primary contact number already existing in db.')
            model.findOne({primarycontactnumber: primarynumber}, (error, data) => {
                if(error){
                    console.log(error)
                    if(response != null){
                        response.writeHead(500, { 'Content-type': 'text/plain'})
                        response.end('internal Server Error')
                    }

                    return
                } else {

                    contact = toContact(requestBody, model)
                    if(!data){
                        console.log('The contact does not exist. It will be created')
                        contact.save((error) => {
                            if(!errror){
                                contact.save()
                            } else {
                                console.log(error)
                            }
                        })

                        if( response != null ){
                            response.writeHead(201, {'Content-Type' : 'text/plain'})
                            response.end('Created')
                        }

                        return

                    } else {
                        console.log(`updating contact with same primary contact ${primarynumber}`)
                        data.firstname = contact.firstname
                        data.lastname = contact.lastname
                        data.title = contact.title
                        data.company = contact.company
                        data.jobtitle = contact.jobtitle
                        data.primarycontactnumber = contact.primarycontactnumber
                        data.othercontactnumbers = contact.othercontactnumbers
                        data.emailaddresses = contact.emailaddresses
                        data.primaryemailaddress = contact.primaryemailaddress
                        data.groups = contact.groups
                    }
                }
            })
        }
    })
}

// find a single entry via the primary contact number
exports.findByNumber = (model, _primarycontactnumber, response) => {
    model.findOne({primarycontactnumber: _primarycontactnumber}, (error, result) => {
        if(error) {
            console.error(error)
            response.writeHead(500, {'Content-Type': 'text/plain'})
            response.end('Internal Server Error')
            return
        } else {
            if(!result){
                if(response != null) {
                    response.writeHead(404, {'Content-Type':'text/plain'})
                    response.end('Not Found')
                }
                return
            }
        }

        if( response != null){
            response.setHeader('Content-Type','applciation/json')
            response.send(result)
        }
        console.log(result)
    })
}

//Returns all entries as a list
exports.list = (model, response) => {
    model.find({}, (error, result) => {
        if(error){
            console.error(error)
            return null
        }
        if(response != null){
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(result))
        }
        return JSON.stringify(result)
    })
}

// Query by argument. Returns all that contain a certain key val pair
exports.query_by_arg = function (model, key, value, response) {
    // build a JSON string with the attribute and the value
    const filterArg = '{"' + key + '":' + '"' + value + '"}'
    const filter = JSON.parse(filterArg)
    model.find(filter, function(error, result){
        if(error){
            console.error(error)
            response.writeHead(500, {'Content-Type' : 'text/plain'})
            response.end('Internal server error')
            return
        } else {
            if (!result) {
                if(response != null) {
                    response.writeHead(404, {'Content-Type' : 'text/plain'})
                    response.end('Not Found')
                }

                return
            }
            if(response != null){
                response.setHeader('Content-Type','application/json')
                response.send(result)
            }
        }
    })
}

// takes the body of a request along with the Contact constructor and returns an instance of Contact
const toContact = (body, Contact) => {
    return new Contact({
        firstname: body.firstname,
        lastname: body.lastname,
        title: body.title,
        company: body.company,
        jobtitle: body.jobtitle,
        primarycontactnumber: body.primarycontactnumber,
        primaryemailaddress: body.primaryemailaddress,
        emailaddresses: body.emailaddresses,
        groups: body.groups,
        othercontactnumbers: body.othercontactnumbers
    })
}