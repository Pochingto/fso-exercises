const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI
mongoose.connect(uri)
const personSchema = new mongoose.Schema({
  name: {
    type: String, 
    minLength: 3,
    required: true
  },
  number: {
    type: String, 
    minLength: 8,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d{1,}$/.test(v)
      },
      message: (prop) => `${prop.value} is not a valid phone number!`
    },
     required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)