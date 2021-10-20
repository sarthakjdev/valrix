module.exports = async (client) => {
    console.log(`==== Bot ready :: ${client.user.username} =====`)
    const setStatus = () => client.user.setActivity(`Valorant`)
    setStatus()
}
