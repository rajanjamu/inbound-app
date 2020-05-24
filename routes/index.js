const express   = require('express'),
      router    = express.Router(),
      Enquiry   = require('../models/enquiry'),
      Employee  = require('../models/employee'),
      Department= require('../models/department'),
      Channel   = require('../models/channel')

router.get('/', async (req, res) => {
    try {
        const enquiries = await Enquiry.find()
        const employees = await Employee.find()
        const departments = await Department.find()
        const channels = await Channel.find()

        res.render('index', { enquiries, employees, departments, channels })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router