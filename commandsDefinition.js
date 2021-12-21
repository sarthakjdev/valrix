module.exports = [
    {
        name: 'gsq',
        description: 'Initiate the queue process .',
    },
    {
        name: 'register',
        description: 'register yourself with your valorant account',
        options: [
            {
                name: 'valorant-id',
                description: 'Valorant in-game name. Example Hiro',
                type: 'STRING',
                required: true,
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
            {
                name: 'history',
                description: 'match history of a team upto 5 matches',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'team of the user mentioned',
                        type: 'USER',
                    },
                    {
                        name: 'team',
                        description: 'name of the team',
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
    {
        name: 'stage-teams',
        description: 'staging teams for ranking',
    },
    {
        name: 'player',
        description: 'get information about user',
        type: 2,
        options: [
            {
                name: 'info',
                description: 'get user\'s team',
                type: 1,
                options: [
                    {
                        name: 'user',
                        description: 'user whom information you want  (leave empty if want your own)',
                        type: 'USER',
                    },
                ],
            },
        ],
    },
    {
        name: 'leaderboard',
        description: 'shows the leaderboard',
    },
]
