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

    async getPlayerRating(region, name, tag) {
        try {
            const { data: { data } } = await this.axios.get(`/valorant/v1/mmr/${region}/${name}/${tag}`)

            return data
        } catch (err) {
            return undefined
        }
    }

    async getPlayerMatches(region, name, tag) {
        try {
            const { data: { data } } = await this.axios.get(`/valorant/v3/matches/${region}/${name}/${tag}`)

            return data
        } catch (err) {
            return undefined
        }
    }

    async getMatchStats(region, name, tag) {
        const playerMatches = await this.getPlayerMatches(region, name, tag)
        const match = await playerMatches.filter((m) => m.metadata.mode === 'Custom Game')[0]
        if (!match) return undefined

        return match
    }
}

module.exports = new ValorantAPI()
