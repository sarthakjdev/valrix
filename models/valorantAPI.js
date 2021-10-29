const axios = require('axios')

class ValorantAPI {
    constructor() {
        this.region = process.env.REGION || 'na'
        this.axios = axios.create({ baseURL: 'https://api.henrikdev.xyz' })
    }

    async getPlayerByIGN(name, tag) {
        try {
            const { data: { data } } = await this.axios.get(`/valorant/v1/account/${name}/${tag}?force=true`)

            return data.region === this.region ? data : undefined
        } catch (err) {
            return undefined
        }
    }
}

module.exports = new ValorantAPI()
