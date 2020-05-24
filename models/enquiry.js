const mongoose = require('mongoose')
const Department = require('./department')
const Channel = require('./channel')

const enqSchema = new mongoose.Schema({
    prospectName: String,
    mobileNumber: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Department
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Channel
    },
    remarks: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('Enquiry', enqSchema)