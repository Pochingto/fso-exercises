const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean,
    user: String
})
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        // console.log('logging document: ', document, typeof(document))
        // console.log('logging returnedObject', returnedObject, typeof(returnedObject))
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)