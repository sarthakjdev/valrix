### Working of bot 

- command names : 

     1. /registerteam 
    
     2. /addSubstitute
    
     3. /addPlayer

     5. /report

     6. 

- players will register their riot id with us .   
                                               input:   > riotInGameName
                                                        > riotTagLine 
                                                        > region

-  captain will register their team. 
                                   asking input as : > teamName
                                                     > captain
                                                     > players

-  Extra features : 
    1. adding substitute players in the team
    2. removing a player from the team. 
    3. updating team status.


-  first matches will be played randomly, as we dont have rankng right now. 

-  runnning a command to start matching of the team.


-  teams will be matched on the basis of their ranking, or say avaerga mmr of the teams. 

-  average mmr of the team will be calculated as follows  : sum of mmr of all players / number of players. 

-  after the teams has been matched, they will pinged and provided with some channels for each match as follows: 

        1. game-settings (to select map and site.)
        2. chat-here (common for bot the teams)
        3. teamA VC 
        4. teamB VC 


- As match ends, the captain or say score-reporter will report in a specific channel with '/report', then: 

 1. an api call will be made first to get the recent match-list of the player.
 2. then, again an api call will be made to get the stats of most recent match 3rom the results. 
 4. then the process of ranking will start, uisng that formula
 5. allotment of rank, after comaparing the scores then sorting them in discord.
 6. Now, two things to eb done using these score board from db :

                            1. A top 10 team showing leaderboard for discord.
                            2. sending the data to show in website. 

- Now, mechanism to delete channels needed.
                    


## challanges: 

 > What if teams at the time of match is not available after getting themseleves registered. 

## Questions: 

> Can we use players own mmr alloted by valorant iself for matchmaking purpose, instead of using our ranks, that would be more feasible and conveninet way. 
