const mongoose = require('mongoose')
const Department = require('./department')
const Channel = require('./channel')

const employeeSchema = new mongoose.Schema({
    name: String,
    mobileNumber: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Department
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Channel
    },
    smsStatus: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', employeeSchema)