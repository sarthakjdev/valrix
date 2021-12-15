class Match {
    constructor(data) {
        this.uuid = data.uuid
        this.winningTeamUUID = data.winningTeamUUID
        this.winningTeamName = data.winningTeamName
        this.losingTeamUUID = data.losingTeamUUID
        this.losingTeamName = data.losingTeamName
        this.map = data.map
        this.eloDiff = data.eloDiff
        this.totalRounds = data.totalRounds
        this.score = data.score
    }
}

module.exports = Match
