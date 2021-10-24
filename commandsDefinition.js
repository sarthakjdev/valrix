
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
        name: 'team-register',
        description: 'Register new team',
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'name',
                description: 'Name of the team',
                type: 'STRING',
                required: true,
            },
            {
                name: 'ign',
                description: 'Your in game name - Example Player#1234',
                type: 'STRING',
                required: true,
            },
        ],
    },
    {
        name: 'team-add-player',
        description: 'Add player to the team',
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'player',
                description: 'The user whom you want to add in your team',
                type: 'USER',
                required: true,
            },
            {
                name: 'playerign',
                description: 'In game name of the player - Example Player#1234',
                type: 'STRING',
                required: true,
            },
        ],
    },
    {
        name: 'team-remove-player',
        description: 'Remove player from your team',
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'player',
                description: 'Player whom you want to remove from team',
                type: 'USER',
                required: true,
            },
        ],
    },
    {
        name: 'team-info',
        description: 'information of your team',
    },
    {
        name: 'report-match-end',
        description: 'To report the ending of the match',
    },
]
