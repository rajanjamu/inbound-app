const express       = require('express'),
      router        = express.Router(),
      Employee      = require('../models/employee'),
      Department    = require('../models/department')

// INDEX
router.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 })
        res.render('employee/index', { employees })
    } catch (e) {
        console.log(e)
    }
})

// NEW
router.get('/employee/new', async (req, res) => {
    const depts = await Department.find()
    res.render('employee/new', { depts })
})

// CREATE
router.post('/employee', async (req, res) => {
    console.log(req.body)
    
    try {
        const dept = await Department.findOne({ name: req.body.deptName })
        const employee = new Employee({
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            'department._id': dept._id,
            'department.name': dept.name
        })
        employee.save()
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/employee/:id/edit', async (req, res) => {
    try {
        const editEmployee = await Employee.findById(req.params.id)
        const employees = await Employee.find()
        res.render('employee/edit', { employees, editEmployee })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/employee/:id', async (req, res) => {
    try {
        const dept = await Employee.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/employee/:id', async (req, res) => {
    try {
        await Employee.findByIdAndRemove(req.params.id)
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router