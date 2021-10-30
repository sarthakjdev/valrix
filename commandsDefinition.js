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
        description: 'operate team for league',
        type: 2,
        options: [
            {
                name: 'create',
                description: 'create a new team',
                type: 1,
                options: [
                    {
                        name: 'name',
                        description: 'name of the team',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'valorant-name',
                        description: 'Valorant in-game name. Example Hiro',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'valorant-tag',
                        description: 'Valorant in-game tag. Example 1234',
                        type: 'NUMBER',
                        required: true,
                    },
                ],
            },
            {
                name: 'delete',
                description: 'Delete a existing team',
                type: 1,
            },
            {
                name: 'add',
                description: 'Add a new player to your team',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'User to be added in your team',
                        type: 'USER',
                        required: true,
                    },
                    {
                        name: 'valorant-name',
                        description: 'Valorant in-game name. Example Hiro',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'valorant-tagline',
                        description: 'Valorant in-game tag. Example 1234 ',
                        type: 'NUMBER',
                        required: true,
                    },
                    {
                        name: 'player-type',
                        description: 'Type of player. Sub/Player',
                        type: 'STRING',
                        required: true,
                        choices: [
                            {
                                name: 'player',
                                value: 'PLAYER',
                            },
                            {
                                name: 'sub',
                                value: 'SUBSTITUTE',
                            },
                        ],
                    },
                ],
            },
            {
                name: 'remove',
                description: 'Remove a player from the team',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'player to be removed from your team',
                        type: 'USER',
                        required: true,
                    },
                ],
            },
            {
                name: 'info',
                description: 'Current information of a team',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: `User who's team info you want to check.`,
                        type: 'USER',
                    },
                    {
                        name: 'team-name',
                        description: 'Name of the team',
                        type: 'STRING',
                    },
                ],
            },

        ],
    },
    {
        name: 'report-match-end',
        description: 'To report the ending of the match',
    },
]
