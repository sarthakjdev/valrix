require('dotenv').config()
const { Intents, Options } = require('discord.js')
const Bot = require('./bot')
const errorPrint = require('./util/errorPrint')

const bot = new Bot({
    shards: 'auto',
    restGlobalRateLimit: 50,
    makeCache: Options.cacheWithLimits({
        MessageManager: 1,
    }),
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
})

process.on('unhandledRejection', (error) => {
    errorPrint(error, { description: 'Unhandled error' })
})

bot.build().then()
