
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
        name: 'register-team-name',
        description: 'provides options for team management',
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'teamname',
                description: 'name of the team',
                type: 'STRING',
                required: true,
            },
        ],
    },
    {
        name: 'team-add-player',
        description: 'add player to the team',
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'playertag',
                description: 'discord tag of the player',
                type: 'USER',
                required: true,
            },
            {
                name: 'playergamename',
                description: 'game name of the player',
                type: 'STRING',
                required: true,
            },
            {
                name: 'playertagline',
                description: 'tagline of the player',
                type: 'NUMBER',
                required: true,
            },
        ],
    },
    {
        name: 'team-remove-player',
        description: 'remove a player from the team',
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'playertag',
                description: 'discord tag of the player',
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
        description: 'to report the ending of the match',
    },

]
