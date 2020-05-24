const express       = require('express'),
      router        = express.Router(),
      Department    = require('../models/department'),
      Employee      = require('../models/employee'),
      Enquiry       = require('../models/enquiry'),
      { timeAgo }   = require('../utils/helper')

// INDEX
router.get('/department', async (req, res) => {
    try {
        const depts = await Department.find().sort({ createdAt: -1 }).lean()
        depts.forEach(dept => dept.timeAgo = timeAgo(dept.updatedAt))

        res.render('department/index', { depts })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/department', async (req, res) => {
    try {
        Department.create(req.body)
        res.redirect('/department')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/department/:id/edit', async (req, res) => {
    try {
        console.log(req.params.id)
        const editDept = await Department
                        .findById(req.params.id)
                        .sort({ updatedAt: -1 })

        const depts = await Department.find()
        
        res.render('department/edit', { depts, editDept })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/department/:id', async (req, res) => {
    try {
        const dept = await Department.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/department')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/department/:id', async (req, res) => {
    try {
        const employee = await Employee.find({ department: req.params.id })
        const enquiry = await Enquiry.find({ department: req.params.id })

        if (!employee && !enquiry) {
            await Department.findByIdAndRemove(req.params.id)
        }
        console.log('Cannot be deleted. Other documents references this department.')
        
        res.redirect('/department')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router