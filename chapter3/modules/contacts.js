const fs = require('fs')

//Instantiate a file reader to be used in different functions 
const read_json_file = () => {
    const file = './data/contacts.json'
    return fs.readFileSync(file)
}

//return entire list as JSON
exports.list = () => {
    return JSON.parse(read_json_file())
}

exports.query = (number) => {
    const json_result = JSON.parse(read_json_file())
    const result = json_result.result

    for(let i = 0; i < result.length; i++){
        let contact = result[i]
        if(contact.primaryContactNumber == number){
            return contact
        }
    }

    return null

}

exports.query_by_arg = (arg, value) => {
    var json_result = JSON.parse(read_json_file())
    var result = json_result.result
    
    for(let i = 0; i < result.length; i++){
        let contact = result[i]
        if(contact[arg] == value){
            return contact
        }
    }

    return {}
}

exports.list_groups = () => {
    const json_result = JSON.parse(read_json_file())
    const result = json_result.result

    const resultArray = new Array ()

    for(let i = 0; i < result.length; i++){

        const groups = result[i].groups

        for(let index = 0; index<groups.length; index++){
            if(resultArray.indexOf(groups[index]) == -1){
                resultArray.push(groups[index])
            }
        }
    }

    return resultArray

}

exports.get_members = (group_name) => {
    const json_result = JSON.parse(read_json_file())
    const result = json_result.result
    const resultArray = new Array ()

    for(let i = 0; i < result.length; i++){
        if(result[i].groups.indexOf(group_name) > -1){
            resultArray.push(result[i])
        }
    }

    return resultArray

}