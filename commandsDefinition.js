const { create } = require('lodash')

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
                        description: 'valorant ingame name',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'valorant-tagline',
                        description: 'valorant tagline',
                        type: 'NUMBER',
                        required: true,
                    },
                ],
            },
            {
                name: 'delete',
                description: 'delete a existing team',
                type: 1,
            },
            {
                name: 'add',
                description: 'add a new player to the team',
                type: 1,
                options: [
                    {
                        name: 'player',
                        description: 'player to be added',
                        type: 'USER',
                        required: true,
                    },
                    {
                        name: 'valorant-name',
                        description: 'valorant ingame name of the player',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'valorant-tagline',
                        description: 'valorant tagline of the player ',
                        type: 'NUMBER',
                        required: true,
                    },
                    {
                        name: 'player-type',
                        description: 'type of player',
                        type: 'STRING',
                        required: true,
                        choices: [
                            {
                                name: 'player',
                                value: 'PLAYER',
                            },
                            {
                                name: 'sub',
                                value: 'SUBUSTITUTE',
                            },
                        ],
                    },
                ],
            },
            {
                name: 'remove',
                description: 'remove a player from the team',
                type: 1,
                options: [
                    {
                        name: 'player',
                        description: 'player to be added',
                        type: 'USER',
                        required: true,
                    },
                ],
            },
            {
                name: 'info',
                description: 'current information of a team',
                type: 1,
                options: [
                    {
                        name: 'player',
                        description: 'player of that team',
                        type: 'USER',
                    },
                    {
                        name: 'team-name',
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
]
