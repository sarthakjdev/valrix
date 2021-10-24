
module.exports = {
    name: 'register-team',
    exec: async (interaction) => {
        const { client, user } = interaction
        const teamName = interaction.options.get('name').value
        user.ign = interaction.options.get('ign').value

        user.player = await client.factory.getPlayerById(interaction.user.id)
        if (user.player && user.player.team) return interaction.reply(`Player already exist for team ${user.player.team.name}`)

        let team = await client.factory.getTeamByName(teamName)
        if (team) return interaction.reply(`Team already exist with same name`)

        team = await client.factory.createTeam(teamName, user)
        const owner = await interaction.client.users.fetch(team.owner.id)

        return interaction.reply(`Team created with name ${team.name} for owner${owner.tag}`)
    },
}
