const { errorEmbed } = require('../struct/components')

const admins = process.env.ADMINS.split(',')

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return
    const command = client.slashCommands.get(interaction.commandName)
    if (command) {
        try {
            if (command.adminOnly && !admins.includes(interaction.user.id)) {
                const embed = errorEmbed('You\'re not allowed to use this command')
                await interaction.reply({ embeds: [embed] })
            } else {
                await command.exec(interaction)
            }
        } catch (err) {
            client.util.errorPrint(err, { description: `command error :: ${interaction.commandName} | ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.user.tag}` })
        }
    }
}
