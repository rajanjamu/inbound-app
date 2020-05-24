module.exports = {
    timeAgo: (timeStamp) => {
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'min', seconds: 60 },
            { label: 'sec', seconds: 1 }
        ]

        const seconds = Math.floor((Date.now() - timeStamp)/1000)

        if (seconds == 0) {
            return '0 secs ago'
        }

        const interval = intervals.find(i => i.seconds <= seconds)
        const count = Math.floor(seconds / interval.seconds)
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
    }
}