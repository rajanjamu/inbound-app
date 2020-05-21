const express   = require('express'),
      router    = express.Router(),
      Enquiry   = require('../models/enquiry'),
      sendSMS   = require('../utils/sms')

router.get('/', (req, res) => {
    res.redirect('/enquiry/1')
})

router.get('/enquiry', (req, res) => {
    res.redirect('/enquiry/1')
})

// NEW
router.get('/enquiry/new', (req, res) => {
    res.render('enquiry/new')
})

// INDEX
router.get('/enquiry/:page', async (req, res) => {
    let filter = {}
    const perPage = 5
    const page = req.params.page || 1

    if (req.query.deptName && req.query.deptName != 'Select Department') {
        filter = req.query
    }

    try {
        const enqs = await Enquiry.find(filter).limit(perPage).skip(perPage * (page - 1)).sort({ createdAt: -1 })

        const countEnqs = await Enquiry.countDocuments(filter)
        const pages = Math.ceil(countEnqs/perPage)

        res.render('enquiry/index', { enqs, filter, page, pages })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/enquiry', async (req, res) => {
    try {
        const enq = await Enquiry.create(req.body)
        sendSMS(enq)
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/enquiry/:id/edit', async (req, res) => {
    try {
        const enq = await Enquiry.findById(req.params.id)
        res.render('enquiry/edit', { enq })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/enquiry/:id', async (req, res) => {
    try {
        const enq = await Enquiry.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/enquiry/:id', async (req, res) => {
    try {
        await Enquiry.findByIdAndRemove(req.params.id)
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

function timeAgo(dateArr) {

}

module.exports = router
