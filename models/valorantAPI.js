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

    async getPlayerRating(name, tag) {
        try {
            const { data: { data } } = await this.axios.get(`/valorant/v1/mmr/${this.region}/${name}/${tag}`)
            console.log(data)

            return data
        } catch (err) {
            return undefined
        }
    }

    async getPlayerLastMatch(name, tag, mode = 'Custom Game') {
        try {
            const { data: { data } } = await this.axios.get(`/valorant/v3/matches/${this.region}/${name}/${tag}`)

            if (!data.length) return undefined

            return data[0].metadata.mode === mode ? data[0] : undefined
        } catch (err) {
            return undefined
        }
    }
}

module.exports = new ValorantAPI()
