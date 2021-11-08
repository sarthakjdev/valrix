
const admins = process.env.ADMINS.split(',')

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return
    const command = client.slashCommands.get(interaction.commandName)
    if (command) {
        try {
            if (command.adminOnly && !admins.includes(interaction.user.id)) {
                // TODO : Put embed here
                await interaction.reply(`You're not allowed to use this command`)
            } else {
                await command.exec(interaction)
            }
        } catch (err) {
            client.util.errorPrint(err, { description: `command error :: ${interaction.commandName} | ${interaction.guild.name} | ${interaction.channel.name} | ${interaction.user.tag}` })
        }
    }
}
