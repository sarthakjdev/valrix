
class Player {
    constructor(data) {
        this.id = data.id
        this.tag = data.valorantName
        this.name = data.valorantTag
        this.status = data.status
        this.team = data.team
        this.valorantId = data.valorantId
    }

    get ign() {
        return `${this.name}#${this.tag}`
    }
}

module.exports = Player
