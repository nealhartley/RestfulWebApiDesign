const mongoose = require('mongoose')

// This will be used to ensure the db is prepared for our tests to be run
// It will go through and clear all records in the db

//beforeEach() is a function that will be called before each test is executed
beforeEach((done) => {
    const clearDatabase = () => {
        console.log("starting clean")
        for(let i in mongoose.connection.collections){
            mongoose.connection.collections[i].remove(() => {})
        }
        console.log("finished clean")
        return done()
    }

    if(mongoose.connection.readyState === 0){
        mongoose.connect(config.db.test, (err) => {
            if(err){
                throw err
            }
            return clearDatabase()
        })
    } else {
        return clearDatabase()
    }
})

//AfterEach() is a fucntion that will be called after each test is executed.
afterEach((done) => {
    mongoose.disconnect()
    return done()
})