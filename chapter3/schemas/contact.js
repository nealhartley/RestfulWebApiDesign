const mongoose = require('mongoose')
const contactSchema = new mongoose.Schema({
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

// this is a model - a instance of our schema that gives us abilities to poll our db based on the schema its using.
const Contact = mongoose.model('Contact', contactSchema)


//making connection to db
const db = mongoose.connection
mongoose.connect('mongodb://localhost/contacts')

//------instantiate an object that matches schema and then put into db
var john_douglas = new Contact({
    firstname: "John",
    lastname: "Douglas",
    title: "Mr",
    company: "Dev Inc.",
    jobtitle: "Developer",
    primarycontactnumber: "+359777223345",
    othercontactnumbers: [],
    primaryemailaddress: "john@douggie.com",
    emailaddresses: ["j@d.com"],
    groups: ["Dev"]
})

// john_douglas.save((e) => {
//     if(e){
//         console.log('Error in saving contact j Dougy')
//         console.log(e)
//     } else {
//         john_douglas.save()
//         console.log("J Dougy is saved!!!")
//     }
// })

// Model.find() - gives us the ability to search for data based on given key value pairs
Contact.find({groups: "Dev", title: "Mr"}, (error, result) => {
    if(error){
        console.error(error)
    } else {
        console.log("In find" + result)
    }
})

//Model.findOne() - gives us the ability to search for exactly one record  
Contact.findOne({primarycontactnumber: "+359777223345"}, 
    (error, data) => {
        if(error){
            console.log(error)
            return
        } else {
            if(!data){
                console.log("not found")
                return;
            } else {
                // we can call methods on the returned data to modify or delete it
                // I.e. Update and Delete from CRUD - in this case we Delete
                console.log("in findOne" + data)
                data.remove((error) => {
                    if(!error) {data.remove()}
                    else{console.log(error)}
                })
            }
        }
    }
)