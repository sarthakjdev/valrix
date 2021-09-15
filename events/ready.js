module.exports = async (client) => {
    console.log(`==== Bot ready :: ${client.user.username} =====`)
    const setStatus = () => client.user.setActivity(`Yes! I am the step bot of the main version. And I am here for testing.`)
    setStatus()
}
