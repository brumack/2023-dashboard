import axios from 'axios'

class KrackenAPI {
    constructor() {
        this.baseUrl = 'https://api.kraken.com/0/public';
    }

    getQuote = async ticker => {
        const res = await axios.get(`${this.baseUrl}/Ticker?pair=${ticker}`)
        const correctTicker = Object.keys(res.data?.result)
        return res.data?.result[correctTicker].c[0]
    }
}

export default new KrackenAPI()