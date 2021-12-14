class Match {
    constructor(data) {
        this.uuid = data.uuid
        this.winnningTeam = data.winningTeam
        this.losingTeam = data.losingTeam
        this.map = data.map
        this.eloDiff = data.eloDiff
        this.totalRounds = data.totalRounds
        this.score = data.score
    }
}

module.exports = Match
