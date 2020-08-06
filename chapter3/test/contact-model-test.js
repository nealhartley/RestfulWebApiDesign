const mongoose = require('mongoose')
const should = require('should')
const prepare = require('./prepare')

mongoose.connect('mongodb://localhost/contacts-test')

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

const Contact = mongoose.model('Contact', contactSchema)

describe('Contact: models', () => {
    describe('#create()', () => {
        it('Should create a new Contact', (done) => {

            const contactModel = {
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
            }

            Contact.create(contactModel, (err, createdModel) => {
                //error checking
                should.not.exist(err)

                // Assertions that the returned contact is as expected
                createdModel.firstname.should.equal("John")
                createdModel.lastname.should.equal("Douglas")
                createdModel.title.should.equal("Mr")
                createdModel.jobtitle.should.equal("Developer")
                createdModel.primarycontactnumber.should.equal("+359777223345")
                createdModel.primaryemailaddress.should.equal("john@douggie.com")
                createdModel.groups[0].should.equal("Dev")
                createdModel.emailaddresses[0].should.equal("j@d.com")

                //notify mocha we are finished
                done()
            })
        })
    })
})