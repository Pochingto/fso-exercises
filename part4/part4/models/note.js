const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
        console.log('database connected successfully.')
    })
    .catch((error) => {
        console.log(`database connection failed, error message: ${error.message}`)
    })

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean
})
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        console.log('logging document: ', document, typeof(document))
        console.log('logging returnedObject', returnedObject, typeof(returnedObject))
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)