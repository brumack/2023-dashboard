import axios from 'axios'

class Threshold {
    constructor() {
        this.preUrl = 'http://164.92.214.13:9151/status?json=true';
        this.tBTCurl = 'http://ec2-54-183-240-12.us-west-1.compute.amazonaws.com:9601/metrics'
    }

    preHealth = async () => axios.get(this.preUrl, { rejectUnauthorized: false })

    tBTChealth = async () => axios.get(this.tBTCurl, { rejectUnauthorized: false })
}

export default new Threshold()