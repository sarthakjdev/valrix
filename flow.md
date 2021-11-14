### Working of bot 


- operations : 

        1. Create team (Only owner)
        2. Delete team (Only owner)
        3. Add Player (only 5 players as main and 3 as substitute) 
                                                                    a. if usre is a owner or not. 
                                                                    b. if valo account exist or not. 
                                                                    c. Check the status of the players in (No of mains and subs)
                                                                    d. get mmr of the player and calculate average of team for intial ranking .

                        
        4. Remove Player
        5. Player can leave team. (Any player can do that instead of owner)
        6. getting team information (Any player)
        7. change status of player from main to substitute and vice versa
        8. get user info (team , valo-ign etc)

- command names : 

     1. /gsq   :- to start the queuing process for registered team. 
    
     2. /register-team   : 
    
     3. /team-remove-player

     4. /team-add-player

     5. /team-info

     6. /user-info

     6. report-match-end

     7. delete-channels 


- players will register their riot id with us .   
                                               input:   > riotInGameName
                                                        > riotTagLine 
                                                        > region

-  captain will register their team. 
                                   asking input as : > teamName
                                                     > captain
                                                     > players


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


- Way to find the initial rating of a team :-

```so here are the steps for calculating initial elo:
1. Step 1 find rank of all players
2. Take average of the rank using the given values 
3. Plug average into this formula: 1700-(400*(1-("rating"/105)))
```

- Function need to us eteh team rating after a match :-

```
function eloDiff(team1_elo, team2_elo, team1_score, team2_score) {
  /*
  A function for outputting the change in a team1's ELO score.

  team1_elo: The ELO of team 1.
  team2_elo: The ELO of team 2.
  team1_score: The score of team 1.
  team2_score: The score of team 2.
   */
  return 30 * (team1_score > team2_score) -
    1/(10**((team1_elo - team2_elo)/400)+1) *
    (Math.log(2 * Math.abs(team1_score - team2_score) + 1) * 2.2 /
    ( team1_score > team2_score ? team1_elo - team2_elo : (team2_elo - team1_elo)*0.001 + 2.2));
}

console.log(eloDiff(true, 20,  30, 2, 3));
```



## challanges: 

 > What if teams at the time of match is not available after getting themseleves registered. 

## Questions: 

> Can we use players own mmr alloted by valorant iself for matchmaking purpose, instead of using our ranks, that would be more feasible and conveninet way. 



# BUGS 

 -After team plater being added, it doesnt updates the mssg properly.
 - It sends three four 