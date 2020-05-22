const mongoose = require('mongoose')
const Department = require('./department')
const Channel = require('./channel')

const employeeSchema = new mongoose.Schema({
    name: String,
    mobileNumber: String,
    department: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Department
        },
        name: String
    },
    channel: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Channel
        },
        name: String
    },
    smsStatus: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', employeeSchema)