const mongoose = require('mongoose')

const deptSchema = new mongoose.Schema({
    name: String,
    description: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Department', deptSchema)