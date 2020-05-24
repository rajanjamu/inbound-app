const express       = require('express'),
      router        = express.Router(),
      Channel       = require('../models/channel'),
      Employee      = require('../models/employee'),
      Enquiry       = require('../models/enquiry'),
      { timeAgo }   = require('../utils/helper')

// INDEX
router.get('/channel', async (req, res) => {
    try {
        const channels = await Channel
                        .find()
                        .sort({ updatedAt: -1 })
                        .lean()

        channels.forEach(chnl => chnl.timeAgo = timeAgo(chnl.updatedAt))

        res.render('channel/index', { channels })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/channel', async (req, res) => {
    try {
        Channel.create(req.body)
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/channel/:id/edit', async (req, res) => {
    try {
        const editChnl = await Channel.findById(req.params.id).sort({ createdAt: -1 })
        const channels = await Channel.find()
        res.render('channel/edit', { channels, editChnl })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/channel/:id', async (req, res) => {
    try {
        const dept = await Channel.findByIdAndUpdate(req.params.id, req.body)
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

        if (!employee && !enquiry) {
            await Channel.findByIdAndRemove(req.params.id)
        }
        console.log('Cannot be deleted. Other documents references this channel.')
        
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router