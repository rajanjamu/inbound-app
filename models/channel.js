const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
    name: String,
    description: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Channel', channelSchema)