/* eslint-disable no-await-in-loop */
const { Collection } = require('discord.js')
const createMatch = require('./createMatch')

class QueueManager {
    constructor(opts) {
        this.client = opts.client
        this.queueSize = 2
        this.queue = new Collection()
        this.checkQueueInterval = 60 * 1000 // Every n second check for queue
        this.running = false
    }

    addToQueue(interaction) {
        if (this.queue.has(interaction.user.id)) throw new Error('user already queued')
        this.queue.set(interaction.user.id, interaction)
        if (!this.running) {
            this.running = true
            this.processQueue().then()
        }
    }

    removeFromQueue(interaction) {
        if (this.queue.has(interaction.user.id)) {
            this.queue.delete(interaction.user.id)
        }
    }

    get size() {
        return this.queue.size
    }

    isQueued(userId) {
        this.queue.sweep((interaction) => Date.now() - interaction.createdTimestamp > 900000) // Remove interactions older than 15 minutes because we can't update them

        return this.queue.has(userId)
    }

    async processQueue() {
        while (this.running) {
            await new Promise((r) => setTimeout(r, this.checkQueueInterval))
            this.queue.sweep((interaction) => Date.now() - interaction.createdTimestamp > 900000) // Remove interactions older than 15 minutes because we can't update them
            this.queue = this.queue.sort((i1, i2) => i1.user.userPlayer.team.rating - i2.user.userPlayer.team.rating)
            if (this.queue.size >= this.queueSize) {
                const queueCopy = this.queue.clone()
                this.queue = new Collection()
                await createMatch(queueCopy)
            }
            if (this.queueSize === 0) this.running = false
        }
    }
}

module.exports = QueueManager
