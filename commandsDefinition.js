
module.exports = [
    {
        name: 'gsq',
        description: 'Initiate the queue process .',
    },
    {
        name: 'deletechannels',
        description: 'For cleaning the channels created under queuing system',
        type: 2,
        options: [

            {
                name: 'specific-channel',
                description: 'deletes only selected channel',
                type: 1,
                options: [
                    {
                        name: 'channelname',
                        description: 'for selecting that channel name to be deleted.',
                        type: 'CHANNEL',
                        required: true,
                    },
                ],
            },
            {
                name: 'all',
                description: 'deletes all channels created by this application',
                type: 1,
            },
        ],
    },
    {
        name: 'team',
        description: 'register your team',
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'teamname',
                description: 'name of your team',
                type: 'STRING',
                required: true,
            },
            {
                name: 'captain',
                description: 'name of your player1',
                type: 'USER',
                required: true,
            },
            {
                name: 'playe2',
                description: 'name of your player2',
                type: 'USER',
                required: true,
            },
            {
                name: 'player3',
                description: 'name of your player3',
                type: 'USER',
                required: true,
            },
            {
                name: 'player4',
                description: 'name of your player4',
                type: 'USER',
                required: true,
            },
            {
                name: 'player5',
                description: 'name of your player5',
                type: 'USER',
                required: true,
            },
        ],
    },
]
