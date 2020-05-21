const mongoose = require('mongoose')

const enqSchema = new mongoose.Schema({
    prospectName: String,
    mobileNumber: String,
    deptName: String,
    remarks: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('Enquiry', enqSchema)