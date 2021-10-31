const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'team',
    async create(interaction, userPlayer, valorantPlayer) {
        const { client, user } = interaction
        const teamName = interaction.options.get('name').value
        const valorantName = interaction.options.get('valorant-name').value
        const valorantTag = interaction.options.get('valorant-tag').value
        // Check if player is already in any team
        if (userPlayer && userPlayer.team) return interaction.editReply(`Player already exist for team ${userPlayer.team.name}`)
        // Check for team name
        let team = await client.factory.getTeamByName(teamName)
        if (team) {
            const embed = Components.errorEmbed(`Team already exist with same name`)

            return interaction.editReply(embed)
        }

        // Create new team
        const teamOwner = {
            id: user.id, valorantName, valorantTag, valorantId: valorantPlayer.puuid,
        }
        console.log('success')
        team = await client.factory.createTeam(teamName, teamOwner, userPlayer)
        const owner = await interaction.client.users.fetch(team.owner.id)

        return interaction.editReply(`Team created with name ${team.name} for owner ${owner}`)
    },
    async delete(interaction, userPlayer) {
        const { client } = interaction
        if (!userPlayer || !userPlayer.team || userPlayer.team.ownerId !== userPlayer.id) {
            const embed = Components.errorEmbed(`You're not owner of any team`)

            return interaction.editReply({ embeds: [embed] })
        }
        await client.factory.deleteTeam(userPlayer.team)

        return interaction.editReply(`Team deleted successfully`)
    },
    async add(interaction, userPlayer, valorantPlayer) {
        const { client } = interaction

        const playerType = interaction.options.get('player-type').value || 'SUB'
        const playerToAdd = interaction.options.getUser('user')

        // Check if user is owner
        if (!userPlayer || !userPlayer.team || userPlayer.team.ownerId !== userPlayer.id) {
            const embed = Components.errorEmbed(`You're not owner of any team`)

            return interaction.editReply({ embeds: [embed] })
        }

        // Check if player is already added to any team
        const player = await client.factory.getPlayerById(playerToAdd.id)
        if (player && player.team) return interaction.editReply(`Player ${playerToAdd} already belongs to ${player.team.name}`)

        // Check max subs and player numbers
        if (playerType === 'SUB' && userPlayer.team.sub.length >= 3) {
            const embed = Components.errorEmbed(`Team ${userPlayer.team.name} already have 3 substitute`)

            return interaction.editReply({ embeds: [embed] })
        }

        if (playerType === 'PLAYER' && userPlayer.team.players.length >= 5) {
            const embed = Components.errorEmbed(`Team ${userPlayer.team.name} already have 5 players`)

            return interaction.editReply({ embeds: [embed] })
        }

        if (player) await client.factory.updatePlayerTeam(player.id, userPlayer.team)
        else await client.factory.createPlayer(playerToAdd.id, valorantPlayer.puuid, valorantPlayer.name, valorantPlayer.tag, playerType, userPlayer.team)

        // Need to improve here
        // const playerAddedComponents = Components.teamPlayerComponent(playerToAdd, owner.team, 'added', user)
        // return interaction.editReply(playerAddedComponents)

        return interaction.editReply(`${playerToAdd} has been added to team ${userPlayer.team.name}`)
    },
    async remove(interaction, userPlayer) {
        const { client } = interaction

        const playerToRemove = interaction.options.getUser('user')
        // Check if user is owner
        if (!userPlayer || !userPlayer.team || userPlayer.team.ownerId !== userPlayer.id) {
            const embed = Components.errorEmbed('You must be owner of team to remove player')

            return interaction.editReply({ embeds: [embed] })
        }

        // Check if user belong to team
        if (!userPlayer.team.has(playerToRemove.id)) {
            const embed = Components.errorEmbed('Player doesn\'t belong to your team')

            return interaction.editReply({ embeds: [embed] })
        }
        await client.factory.removePlayer(playerToRemove, playerToRemove.team)
        // const playerRemovalComponents = Components.teamPlayerComponent(playerToRemove, owner.team, 'removed', user)
        //
        // return interaction.editReply(playerRemovalComponents)

        return interaction.editReply(`Removed player ${playerToRemove}`)
    },
    async leave(interaction, userPlayer) {
        const { client } = interaction

        if (!userPlayer || !userPlayer.team) {
            const embed = Components.errorEmbed(`You're does not belong to any team`)

            return interaction.editReply({ embeds: [embed] })
        }
        if (userPlayer.team.ownerId === userPlayer.id) {
            const embed = Components.errorEmbed(`You're owner of the team you can't leave the team`)

            return interaction.editReply({ embeds: [embed] })
        }

        await client.factory.removePlayer(userPlayer.id, userPlayer.team)

        return interaction.editReply('Left the team')
    },
    async info(interaction, userPlayer) {
        const { client } = interaction

        const teamName = interaction.options.get('team-name')?.value
        if (teamName) {
            const team = await client.factory.getTeamByName(teamName)

            return interaction.editReply(`Team found ${team.name}`)
        }
        const playerToSearch = interaction.options.getUser('user')
        const dbPlayerToSearch = await client.factory.getPlayerById(playerToSearch)

        const player = dbPlayerToSearch || userPlayer
        if (!player.team) {
            const embed = Components.errorEmbed(`<@${player.id}> doesn't belong to any team.`)

            return interaction.editReply({ embeds: [embed] })
        }

        return interaction.editReply(`Team found ${player.team.name}`)
    },
    async exec(interaction) {
        const { client, user } = interaction
        await interaction.deferReply()

        const userPlayer = await client.factory.getPlayerById(user.id)

        // Extract valorant player data
        const valorantName = interaction.options.get('valorant-name')?.value
        const valorantTag = interaction.options.get('valorant-tag')?.value
        let valorantPlayer

        // If valorant player inputs are given, make sure user exist
        if (valorantName && valorantTag) {
            valorantPlayer = await valorantAPI.getPlayerByIGN(valorantName, valorantTag)
            if (!valorantPlayer) {
                const embed = Components.errorEmbed(`Valorant Player not found for ${valorantName}#${valorantTag}`)

                return interaction.editReply({ embeds: [embed] })
            }
        }

        switch (interaction.options.getSubcommand()) {
            case 'create':
                return this.create(interaction, userPlayer, valorantPlayer)
            case 'delete':
                return this.delete(interaction, userPlayer)
            case 'add':
                return this.add(interaction, userPlayer, valorantPlayer)
            case 'remove':
                return this.remove(interaction, userPlayer)
            case 'leave':
                return this.leave(interaction, userPlayer)
            case 'info':
                return this.info(interaction, userPlayer)
            default:
                return interaction.editReply('Not implemented')
        }
    },
}
