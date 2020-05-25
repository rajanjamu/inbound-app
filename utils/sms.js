const axios = require('axios')
const Employee = require('../models/employee')

const apiKey = 'XLcNmbODoE6ljcfcy4GaSQ'
const channel = 2 //transactional
const route = 1
const senderId = 'JAMUSK'

const sendSMS = async (enq) => {
    try {
        const url = await getUrl(enq)
        
        if (!url) {
            return false
        }

        await axios.get(url)
        return true
    } catch (e) {
        console.log(e)
    }
}

async function getUrl(enq) {
    const numbers = await getNumbers(enq.channel._id, enq.department._id)

    if (!numbers) {
        return false
    }

    return `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${apiKey}&senderid=${senderId}&channel=${channel}&DCS=0&flashsms=0&number=${numbers}&text=${smsText(enq)}&route=${route}`
}

function smsText({ prospectName, mobileNumber, channel, department, remarks }) {
    return `Enquiry: ${channel.name} - ${department.name}\nMr./Ms. ${prospectName}\n${mobileNumber}\n${remarks}`
}

async function getNumbers(channel, department) {
    try {
        const numbersObj = await Employee
                            .find({ channel, department, isSendSMS: true })
                            .select('mobileNumber1 mobileNumber2 -_id')
                            .lean()
        
        return numbersObj.map(x => Object.values(x).join()).join()
    } catch (e) {
        console.log(e)
    }
}

module.exports = sendSMS