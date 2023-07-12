const config = require('./utils/config')
const url = config.TEST_MONGODB_URI

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => { console.log('MongoDB successfully connected.') })
    .catch(error => { console.error(`Connection failed, error message: ${error.message}` )})

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const newNote = new Note({
    content: 'HTML is easy',
    date: new Date(),
    important: true,
})

newNote
    .save()
    .then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })