const axios = require('axios')
const Employee = require('../models/employee')

const apiKey = 'XLcNmbODoE6ljcfcy4GaSQ'
const channel = 2 //transactional
const route = 1
const senderId = 'JAMUSK'

const sendSMS = async (enq) => {
    try {
        const url = await getUrl(enq)
        const res = await axios.get(url)
    } catch (e) {
        console.log(e)
    }
}

async function getUrl(enq) {
    const numbers = await getNumbers(enq.channelName, enq.deptName)
    return `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${apiKey}&senderid=${senderId}&channel=${channel}&DCS=0&flashsms=0&number=${numbers}&text=${smsText(enq)}&route=${route}`
}

function smsText({ prospectName, mobileNumber, channelName, deptName, remarks }) {
    return `Enquiry: ${channelName} - ${deptName}\nMr./Ms. ${prospectName}\n${mobileNumber}\n${remarks}`
}

async function getNumbers(channelName, deptName) {
    try {
        const numbersObj = await Employee.find({
            'department.name': deptName,
            'channel.name': channelName
        }).select('mobileNumber -_id')
    
        if (numbersObj) {
            return numbersObj.map(x => x.mobileNumber).join()
        } 
    } catch (e) {
        console.log(e)
    }
}

module.exports = sendSMS