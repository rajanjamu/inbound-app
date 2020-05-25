const express       = require('express'),
      router        = express.Router(),
      Channel       = require('../models/channel'),
      Employee      = require('../models/employee'),
      Enquiry       = require('../models/enquiry'),
      { timeAgo }   = require('../utils/helper')

// INDEX
router.get('/channel', async (req, res) => {
    try {
        const channels = await Channel.find().sort({ updatedAt: -1 }).lean()
        channels.forEach(chnl => chnl.timeAgo = timeAgo(chnl.updatedAt))

        res.render('channel/index', { channels })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/channel', async (req, res) => {
    try {
        const channel = await Channel.create(req.body)
        req.flash('success', `New channel created!`)
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/channel/:id/edit', async (req, res) => {
    try {
        const editChnl = await Channel
                            .findById(req.params.id)
                            .sort({ createdAt: -1 })

        const channels = await Channel.find()

        res.render('channel/edit', { channels, editChnl })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/channel/:id', async (req, res) => {
    try {
        const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        req.flash('success', `Channel updated!`)
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/channel/:id', async (req, res) => {
    try {
        const employee = await Employee.find({ channel: req.params.id })
        const enquiry = await Enquiry.find({ channel: req.params.id })


        if (!employee.length && !enquiry.length) {
            const channel = await Channel.findByIdAndRemove(req.params.id)
            req.flash('success', `Channel deleted!`)
        } else {
            req.flash('error', 'Cannot delete. Channel is being used!')
        }
        
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router