require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI

module.exports = {
    PORT,
    MONGODB_URI,
    TEST_MONGODB_URI
}