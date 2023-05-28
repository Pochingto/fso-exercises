const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(`Please provide the database password.`)
    process.exit(1)
}
const password = process.argv[2]
const uri = `mongodb+srv://fullstack:${password}@cluster0.mckhlba.mongodb.net/phonebook`

// console.log(process.argv)
// process.exit(1)

mongoose.set('strictQuery', false)

console.log("connecting to the database...")
mongoose.connect(uri)
console.log(`Databsed connected.`)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String    
})

const Person = mongoose.model('Person', phoneSchema)


if (process.argv.length == 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = new Person({
        name: name,
        number: number
    })
    
    newPerson.save()
        .then(result => {
            // console.log(result)
            console.log(`added ${name} number ${number} to phonebook.`)
            mongoose.connection.close()
        })
}else {
    Person.find({})
        .then(result => {
            result.forEach(person => console.log(person))
            mongoose.connection.close()
        })
}