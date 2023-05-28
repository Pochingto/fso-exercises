const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI
mongoose.connect(uri)
const personSchema = new mongoose.Schema({
  name: String, 
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)