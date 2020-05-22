const axios = require('axios')

const apiKey = 'XLcNmbODoE6ljcfcy4GaSQ'
const channel = 2 //transactional
const route = 1
const number = '9887216666,7892464825'
const senderId = 'JAMUSK'

const sendSMS = async ({prospectName, mobileNumber, channelName, deptName, remarks }) => {
    const smsText = `Inbound Enquiry\nCustomer Name: ${prospectName}\nMobile Number: ${mobileNumber}\nDepartment: ${deptName}\nRemarks: ${remarks}`
    const url =  `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${apiKey}&senderid=${senderId}&channel=${channel}&DCS=0&flashsms=0&number=${number}&text=${smsText}&route=${route}`

    try {
        const res = await axios.get(url)
    } catch (e) {
        console.log(e)
    }
}

module.exports = sendSMS