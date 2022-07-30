//Joseph Rother
//Date of Origination:   2/14/2020
//Most Recent Update     5/29/2020

const discord = require('discord.js');
const bot = new discord.Client();
const prefix = "ww!";
const TOKEN = //private key :/ sorry dudes you know we reppin

bot.on('ready', function(){
    console.log('Ready!');
    reset();
});

bot.on('message', message =>{  
    if(message.author.bot) return;

    if(inGame == 2 && message.guild === null)
    {
        if(message.author == nightOrder[currentWake].person)
        {
            if(nightOrder[currentWake].role.response(nightOrder[currentWake],message.content))
            {
                console.log('brhe');
                nightOrder[currentWake].role.resolve(nightOrder[currentWake]);
                
                currentWake++;
                if(currentWake == nightOrder.length)
                {
                    console.log("brehs?");
                    inGame = 3;
                    setTimeout(() => startDay(), Math.floor((Math.random() * 15000) + 1000));
                }
                else
                {
                    console.log("jkfdl");
                    nightOrder[currentWake].checkShield();
                    nightOrder[currentWake].role.wake(nightOrder[currentWake]);
                }
            }
        } 
    }
    
    else if(inGame == 4 && message.guild === null)
    {
        function isPlayer (x)
        {
            return x.person == message.author;
        }

        rec = players.find(isPlayer)
        if(rec == undefined){return;}

        if(!rec.voted)
        {
            if( isNaN(message.content) || message.content < 0 || message.content >= players.length)
            {
                message.author.send("Invalid Response");
                return;
            }

            let votee = players[message.content];

            if(votee === rec)
            {
                message.author.send("Invalid Response");
                return;
            }

            message.author.send("Vote Confirmed");
            if(rec.newRole.name == "Hunter")
            {
                votee.hunted = true;
                votee.hunters.push(message.author.username);
            }
            votee.votes++;
            rec.voted = true;
            tally++;
        }

        if(tally == players.length)
        {
            let out = "Votes are in!"

            for(let k = 0; k <players.length;k++)
            {
                out+= "\n " + players[k].votes + " - " + players[k].person.username + ": " + players[k].newRole.name;

                if(players[k].hasToken)
                {
                    out += " ::ARTIFACT:: ";
                    out += players[k].token;
                }
                if(players[k].hunted)
                {
                    out+= " ::_HUNTED_::";
                    for(let v = 0;v <players[k].hunters.length;v++)
                    {
                        out+= " -" + players[k].hunters[v] + "-";
                    }
                }

            }

            out+="\n";

            for(let k = 0; k <middle.length;k++)
            {
                out+= "\n " + midLetters[k] + ": " + middle[k].name;
            }

            gameChannel.send(out);
            reset();
        }
    }

    if(!message.content.startsWith(prefix)) return; //only look at messages with correct prefix "ww!"
    
    editmessage = message.content.slice (prefix.length); //removes prefix

    //sets the timer for the bot
    if(editmessage.startsWith("setTime"))
    {
        if(inGame == 0 || message.channel == gameChannel)
        {
            let time = editmessage.slice(8);
            if(isNaN(time) || time<0)
            {
                message.channel.send("Invalid time");
                return
            }
            wakeTimer = time*60*1000;
            message.channel.send("Time set to " + time + " minutes");
        }
        else
        {
            message.channel.send("There is currently a game in another channel");
        }
    }

    //displays the roles and what they do
    if(editmessage == ("rolesJob"))
    {
        let out = "The roles currently implemented are:\n\n";

        out += "__Wake Roles:__\n"
        out += "SN - Sentinel (Adds a shield token to a player of their choice. The card with the shield token can't be touched for the duration of the game.)\n"
        out += "WW - Werewolf (They are on the werewolf team. All werewolves know who eachother are and try to get a villager killed.)\n";
        out += "AW - Alpha Wolf (Is a werewolf and functions like a werewolf, but also adds a 4th middle card that starts as a basic werewolf and can be swapped with a player to make them a werewolf.)\n";
        out += "MI - Minion (They are on the werewolf team but the werewolves don't know who they are. They know who the werewolves are. They are trying to not get a werewolf shot, even at the cost of their own life.)\n";
        out += "MA - Mason (They are on the village team but get to know who eachother are.)\n";
        out += "SE - Seer (May look at the card of one other player, or look at 2 middle cards.)\n";
        out += "RO - Robber (Swaps own card with another player's card and sees the new role.)\n";
        out += "WI - Witch (Looks at a card from the center and swaps it with another player.)\n";
        out += "TM - Troublemaker (Swaps two other players cards without looking that what they are.)\n";
        out += "DR - Drunk (Swaps own card with a center card without looking at new role.)\n";
        
        message.channel.send(out);

        out =  "IN - Insomniac (May see own role at end of the night.)\n";
        out += "RE - Revealer (May look at another player's card, if they see a village role, it is flipped upwards.)\n";
        out += "CU - Curator (Gives an artifact token to another player. The artifact is only seen by that player. That artifact is a random choice from:)\n";
        out += "\tThe Brand of the Villager\t- Puts you on the village team.\n";
        out += "\tThe Cudgel of the Tanner\t- Makes you a tanner.\n";
        out += "\tThe Claw of the Werewolf\t- Puts you on the werewolf team.\n";
        out += "\tThe Void of Nothingness\t- Does nothing.\n";
        out += "\tThe Shroud of Shame\t- Player must leave the voice call and only communicate through text chat.\n";
        out += "\tThe Mask of Muting\t- Player must mute themself for the duration of the game. They may not use text chat.\n";

        out += "\n__No Wake Roles:__\n";
        out += "DW - Dream Wolf (Is a werewolf, but does not get to know who the other werewolves are.)\n";
        out += "VI - Villager (On the villager team. Does no special abilites.)\n";
        out += "HU - Hunter (If killed, they player voted for by the hunter dies.)\n";
        out += "TA - Tanner (Is on neither team, wins if they are killed.)\n";

        message.channel.send(out);
    }

    //displays the roles
    if(editmessage == ("roles"))
    {
        let out = "The roles currently implemented are:\n\n";

        out += "__Wake Roles:__\n"
        out += "SN - Sentinel\n"
        out += "WW - Werewolf\n";
        out += "AW - Alpha Wolf\n";
        out += "MI - Minion\n";
        out += "MA - Mason\n";
        out += "SE - Seer\n";
        out += "RO - Robber\n";
        out += "WI - Witch\n";
        out += "TM - Troublemaker\n";
        out += "DR - Drunk\n";
        out += "IN - Insomniac\n";
        out += "RE - Revealer\n";
        out += "CU - Curator\n";

        out += "\n__No Wake Roles:__\n";
        out += "DW - Dream Wolf\n";
        out += "VI - Villager\n";
        out += "HU - Hunter\n";
        out += "TA - Tanner\n";

        message.channel.send(out);
    }

    //displays a list of commands
    if(editmessage == ("help"))
    {
        out  = "setTime [#] - sets the timer between wake and vote to that time\n";
        out += "roles - displays the currenly implemented roles and their command tags\n";
        out += "rolesJob - roles but it says what they do also\n";
        out += "start [tag,tag,tag,tag] - creates a new game with the roles selected. Add 3 more roles than the number of players\n";
        out += "stop - stops the current game. only use before night has started\n";
        out += "join - adds you to the current game\n";
        out += "startVote - must be used 3 times. Ends the discussion phase and starts the vote\n";

        message.channel.send(out);
    }

    //setting up game
    else if(inGame == 0)
    {

        if(editmessage.startsWith("start"))
        {
            bruh = editmessage.slice(6).split(",");
            roles = new Array();

            for(let i = 0; i<bruh.length;i++)
            {
                roles[i] = addRoles(bruh[i]);
            }

            if(roles.length < 6)
            {
                message.channel.send("Not enough roles added");
                return;
            }

            let out = "The roles are: "
            for(let i = 0; i<roles.length;i++)
            {
                out += "\n" + roles[i].name;
                if(roles[i].name == "Alpha Wolf")
                {
                    hasAlpha = true;
                }
            }

            out +="\nThe game is open to " + (roles.length-3) + " players";
            message.channel.send(out);

            roles = shuffle(roles);    
            players = new Array(roles.length-3);

            gameChannel = message.channel;

            gameChannel.send("Created new game.");
            inGame = 1;
        }
    }

    //done for now
    else if(inGame == 1)
    {
        if(message.channel ==  gameChannel)
        {
            if(editmessage == "stop")
            {
                gameChannel.send("Game has been stopped.");
                reset();
                return;
            }

            if(editmessage == "join")
            {
                players[totalNum] = new Player(message.author,roles[totalNum]);
                totalNum++;
                gameChannel.send("Joined game");
            } 

            if(totalNum == players.length)
            {
                inGame = 2;
                gameChannel.send("Game is Starting");
                nightOrder = players.slice();
                nightOrder = nightOrder.sort(function(a,b){return a.role.order-b.role.order;})

                for (let i = 0; i < middle.length; i++) 
                {
                    middle[i] = roles[roles.length - 1 -i];
                }

                if(hasAlpha)
                {
                    middle[3] = new Werewolf();
                }

                for(let i = 0; i < nightOrder.length; i++)
                {
                    nightOrder[i].person.send("Your role is: " + nightOrder[i].role.name);
                }

                console.log("breh");
                setTimeout(() => startNight(), Math.floor((Math.random() * 15000) + 1000));
            }
        }
        else
        {
            message.channel.send("There is currently a game in another channel");
        }
    }

    //done for now
    else if(inGame == 3)
    {
        if(message.channel == gameChannel)
        {
            if(editmessage == "startVote")
            {
                voteos++;
                if(voteos >= 3)
                {
                    startVote();
                }
                else
                {
                    gameChannel.send(voteos + "/3 end votes confirmed");
                }
            }
        }
    }

});

//done for now
function startVote()
{
    if(inGame == 3)
    {
        inGame = 4;
        gameChannel.send("Time's up. Go to your DMs to vote");
        for(let i = 0; i < players.length;i++)
        {
            let out = "Type the number of the person you're voting for:";
            for(let k = 0; k <players.length;k++)
            {
                if(players[k] != players[i])
                out+= "\n " + k + " - " + players[k].person.username;
            }
            players[i].person.send(out);
        }
    }
}

//done for now
function addRoles(x)
{

    if( x == "VI") { return new Villager;}
    if( x == "WW") { return new Werewolf;}
    if( x == "HU") { return new Hunter;}
    if( x == "TA") { return new Tanner;}
    if( x == "SE") { return new Seer;}
    if( x == "RO") { return new Robber;}
    if( x == "MA") { return new Mason;}
    if( x == "IN") { return new Insomniac;}
    if( x == "TM") { return new Troublemaker;}
    if( x == "DR") { return new Drunk;}
    if( x == "MI") { return new Minion;}
    if( x == "WI") { return new Witch;}
    if( x == "AW") { return new AlphaWolf;}
    if( x == "CU") { return new Curator;}
    if( x == "SN") { return new Sentinel;}
    if( x == "DW") { return new DreamWolf;}
    if( x == "RE") { return new Revealer;}
    else
    {
        return new Villager;
    }
}

function startNight()
{
    for(let i = 0;i<players.length;i++)
    {
        console.log(players[i].role.name);
    }
    console.log();

    for(let i = 0;i<middle.length;i++)
    {
        console.log(middle[i].name);
    }
    console.log();

    for(let i = 0; i<nightOrder.length;i++)
    {
        console.log(nightOrder[i].person.username);
    }

    nightOrder[currentWake].checkShield();
    nightOrder[currentWake].role.wake(nightOrder[currentWake]);
}

function startDay()
{

    gameChannel.send("Everybody wake up, you have " + (wakeTimer/(60*1000)) + " minutes to discuss");

    let out = "The table order is: ";
    out += listPlayers(null);
    out += "\n";
    out += listMid();
    gameChannel.send(out)
    

    setTimeout(() => startVote(), wakeTimer);
}

function reset()
{
    //whole game
    inGame = 0;
    players = new Array();
    middle = new Array(3);
    voteos = 0;
    hasAlpha = false;

    //beginning phase
    roles = new Array();
    totalNum = 0;

    //night phase
    nightOrder = new Array();
    currentWake = 0;

    //end
    tally = 0;
}

//whole game
var inGame;
var players;
var gameChannel;
var middle;
var wakeTimer = 0;
var voteos;
const midLetters = ["A","B","C","D"];
var hasAlpha;

//beginning phase
var roles;
var totalNum;

//night phase
var nightOrder;
var currentWake;

//end
var tally;

bot.login(TOKEN);


class Player
{
    person;
    role;
    newRole;
    sent = false;
    ready = false;

    voted = false;
    votes = 0;
    hunted = false;
    hunters = new Array();
    hasToken = false;
    token;
    hasShield = false;
    revealed = false;

    resolved = false;

    constructor(p,r)
    {
        this.person = p;
        this.role = r;
        this.newRole = this.role;
    }

    checkShield()
    {
        if(this.hasShield)
        {
            this.person.send("You have been given a shield token");
        }
    }
}

class Role
{
    name;
    order;
    team;

    wake(x)
    {
        
    }
    response(x,y)
    {
        return true;
    }
    resolve(x){}
}

//wake
class Sentinel extends Role
{
    name = "Sentinel";
    order = 0;
    team = 0;

    abstain = false;
    cardChoice;

    wake(x)
    {

        let out = "You may select a player to give a shield token to, meaning their card cannot be touched, or type a to abstain";
        out += listPlayers(x);
        x.person.send(out);
    }
    response(x,y)
    {
        if(isNaN(y))
        {
            this.abstain = abstainPick(x,y);
            if(!this.abstain){return false;};
            return true;
        }

        if(!validPlayer(x,y)){return false;}

        this.cardChoice = y;
        return true;
    }
    resolve(x)
    {
        if(!this.abstain)
        {
            players[this.cardChoice].hasShield = true;
            x.person.send("Token given.");
        }
    }
}

class Werewolf extends Role
{
    name = "Werewolf";
    order = 1;
    team = 1;

    only = false;
    cardChoice;
    wake(x)
    {
        let out = "You are on the werewolf team, and are trying to either get a villager shot or your minion.";
        let werewolves = searchTeam(x.person,this.team);

        if(werewolves.length > 0)
        {
            out += "\nThe other werewolves are:";
            for(let i = 0; i < werewolves.length; i++)
            {
                out += "\n" + werewolves[i].person.username;
            }
            out += "\nType anything to continue";
        }
        else
        {
            this.only = true;
            out += "\nYou are the only werewolf. Please select a card from the center to look at.";   
            out += listMid();
        }
        x.person.send(out);
    }
    response(x,y)
    {
        if(this.only)
        {
            this.cardChoice = validMid(x,y);
            if(this.cardChoice < 0){return false;}
        }
        return true;
    }
    resolve(x)
    {
        if(this.only)
        {
            let out = "Middle Card " + midLetters[this.cardChoice] + " is: " + middle[this.cardChoice].name;
            x.person.send(out);
        }
    }
}

class AlphaWolf extends Role
{
    name = "Alpha Wolf";
    order = 1.5;
    team = 1;

    only = false;
    onlyPicking = false;
    cardChoice;
    swapChoice;
    wake(x)
    {
        let out = "You are on the werewolf team, and are trying to either get a villager shot or your minion. You also must swap another player's card with the center werewolf card.";
        let werewolves = searchTeam(x.person,this.team);

        if(werewolves.length > 0)
        {
            out += "\nThe other werewolves are:";
            for(let i = 0; i < werewolves.length; i++)
            {
                out += "\n" + werewolves[i].person.username;
            }

            out += "\nSelect a player to swap with center werewolf.";
            out += listPlayers(x);

        }
        else
        {
            this.only = true;
            this.onlyPicking = true;
            out += "\nYou are the only werewolf. Please select a card from the center to look at.";   
            out += listMid();
            
        }
        x.person.send(out);
    }
    response(x,y)
    {
        if(this.onlyPicking)
        {
            this.cardChoice = validMid(x,y);
            if(this.cardChoice < 0){return false;}
            this.onlyPicking = false;
            let out = "Now select a player to swap with the center werewolf card.";
            out += listPlayers(x);
            x.person.send(out);
            return false;
        }
        if(!validPlayer(x,y)){return false;}

        this.swapChoice = y;
        return true;
    }
    resolve(x)
    {
        let out = "";
        if(this.only)
        {
            out += "Middle Card " + midLetters[this.cardChoice] + " is: " + middle[this.cardChoice].name +"\n";

        }

        let temp = middle[3];
        middle[3] = players[this.swapChoice].newRole;
        players[this.swapChoice].newRole = temp;
        out +="Sucessfully Swapped.";

        x.person.send(out);
    }
}

class Minion extends Role
{
    name = "Minion";
    order = 2;
    team = 2;
    wake(x)
    {
        let werewolves = searchTeam(null,1);
        let out = "";

        if(werewolves.length > 0)
        {
            out = "The werewolves are:";
            for(let i = 0; i < werewolves.length; i++)
            {
                out += "\n" + werewolves[i].person.username;
            }
        }
        else
        {
            out = "There are no werewolves. Avoid dying to win for the werewolf team.";
        }

        out += "\nType anything to continue";
        x.person.send(out);
    }
}

class Mason extends Role
{
    name = "Mason";
    order = 3;
    team = 3;

    only = false;
    cardChoice;
    wake(x)
    {
        let masons = searchTeam(x.person,this.team)
        let out = "";

        if(masons.length > 0)
        {
            out = "The other masons are:";
            for(let i = 0; i < masons.length; i++)
            {
                out += "\n" + masons[i].person.username;
            }
        }else
        {
            out = "You are the only mason";
        }

        out+="\nType anything to continue";
        x.person.send(out);
    }
}

class Seer extends Role
{
    name = "Seer";
    order = 4;
    team = 0;

    mid = false;
    cardChoice = new Array();
    wake(x)
    {
        let out = "You may select a player to look at, or may select 2 of the center cards using a comma. ex: 'A,B'";

        out += listPlayers(x);
        out += "\n";
        out += listMid();

        x.person.send(out);
    }
    response(x,y)
    {
        if(isNaN(y))
        {
            let picks = new Array();
            picks = y.split(",");
            console.log(y);
            console.log(picks[0]);
            this.cardChoice[0] = validMid(x,picks[0]);
            if(this.cardChoice[0]<0){return false;}
            
            this.cardChoice[1] = validMid(x,picks[1]);
            if(this.cardChoice[1]<0){return false;}

            this.mid = true;
            return true;
        }

        if(!validPlayer(x,y)){return false;}

        this.cardChoice[0] = y;
        return true;
    }
    resolve(x)
    {

        if(this.mid)
        {
            let out = "Middle card " + (midLetters[this.cardChoice[0]]) + ": " + middle[this.cardChoice[0]].name;
            out += "\nMiddle card " + (midLetters[this.cardChoice[1]]) + ": " + middle[this.cardChoice[1]].name;
            x.person.send(out);
        }else
        {
            x.person.send("That player's card is: " + players[this.cardChoice[0]].newRole.name);
        }
    }
}

class Robber extends Role
{
    name = "Robber";
    order = 5;
    team = 0;

    abstain = false;
    cardChoice;

    wake(x)
    {
        let out = "You may select a player to swap with, or type a to abstain";
        out += listPlayers(x);
        x.person.send(out);
    }
    response(x,y)
    {
        if(selfswap(x))
        {
            this.abstain = true;
            return true;
        }
        if(isNaN(y))
        {
            this.abstain = abstainPick(x,y);
            if(!this.abstain){return false;};
            return true;
        }

        if(!validPlayer(x,y)){return false;}

        this.cardChoice = y;
        return true;
    }
    resolve(x)
    {
        if(!this.abstain)
        {
            let temp = players[this.cardChoice].newRole;
            players[this.cardChoice].newRole = x.newRole;
            x.newRole = temp;

            x.person.send("Successfully swapped. Your new role is: " + temp.name);
        }
    }
}

class Witch extends Role
{
    name = "Witch";
    order = 5.5;
    team = 0;

    abstain = false;
    pickedMid = false;
    cardChoice;
    swapChoice;
    wake(x)
    {
        let out = "You may select a card to look at, and then swap that card with another player's card, or type a to abstain";
        out += listMid();
        x.person.send(out);
    }
    response(x,y)
    {
        if(!this.pickedMid)
        {
            if(y == "a")
            {
                this.abstain = true;
                return true;
            }
            this.cardChoice = validMid(x,y);
            if(this.cardChoice <0){return false;}

            this.pickedMid = true;
            let out = "Middle card " + (midLetters[this.cardChoice]) + ": " + middle[this.cardChoice].name;
            out += "\nSelect a player to swap this card with.";
            out += listPlayers(x);
            x.person.send(out);
            return false;
        }
        else
        {
            
            if(!validPlayer(x,y)){return false;}
            this.swapChoice = y;
            console.log(y);
            return true;
        }
    }
    resolve(x)
    {
        if(!this.abstain)
        {
            let temp = players[this.swapChoice].newRole;
            players[this.swapChoice].newRole = middle[this.cardChoice];
            middle[this.cardChoice] = temp;
            x.person.send("Successfully swapped.");
        }
    }
}

class Troublemaker extends Role
{
    name = "Troublemaker";
    order = 6;
    team = 0;

    abstain = false;
    cardChoice = new Array();
    wake(x)
    {
        let out = "You may select 2 players to swap by typing choice1,choice2 (ex. '3,2'), or type a to abstain. ";
        out += listPlayers(x);
        x.person.send(out);
    }
    response(x,y)
    {
        this.cardChoice = y.split(",");
        if(isNaN(this.cardChoice[0]))
        {
            this.abstain = abstainPick(x,this.cardChoice[0]);
            if(!this.abstain){return false;};
            return true;
        }

        if(isNaN(this.cardChoice[1]))
        {
            x.person.send("Invalid response. Please select from the list");
            return false;
        }


        if(!validPlayer(x,this.cardChoice[0])){return false;}
        if(!validPlayer(x,this.cardChoice[1])){return false;}

        return true;
    }
    resolve(x)
    {
        if(!this.abstain)
        {
            let temp = players[this.cardChoice[0]].newRole;
            players[this.cardChoice[0]].newRole = players[this.cardChoice[1]].newRole;
            players[this.cardChoice[1]].newRole = temp;
            x.person.send("Successfully swapped");
        }
    }
}

class Drunk extends Role
{
    name = "Drunk";
    order = 7;
    team = 0;
    
    cardChoice;

    cant = false;
    wake(x)
    {
        let out = "Please select a card from the center to swap with."
        out += listMid();
        x.person.send(out);
    }
    response(x,y)
    {
        if(selfswap(x))
        {
            this.cant = true;
            return true;
        }
        this.cardChoice = validMid(x,y);
        if(this.cardChoice<0){return false;}
        return true;
    }
    resolve(x)
    {
        if(!this.cant)
        {
            let temp = middle[this.cardChoice];
            middle[this.cardChoice] = x.newRole;
            x.newRole = temp;
            x.person.send("Successfully swapped");
        }
    }
}

class Insomniac extends Role
{
    name = "Insomniac";
    order = 8;
    team = 0;
    wake(x)
    {
        if(!selfswap(x))
        {
            let out = "Your new role is: " + x.newRole.name;
            out +="\nType anything to continue";
            x.person.send(out)
        }
    }
}

class Revealer extends Role
{
    name = "Revealer";
    order = 10;
    team = 0;

    cardChoice;
    wake(x)
    {
        let out = "You may select a player to reveal. Their card will be flipped over if they are village team.";
        out += listPlayers(x);
        x.person.send(out);
    }
    response(x,y)
    {
        if(!validPlayer(x,y)){return false;}

        this.cardChoice = y;
        return true;
    }
    resolve(x)
    {
        let roleo = players[this.cardChoice].newRole;
        x.person.send("That player's card is: " + roleo.name);
        if(roleo.team != 1 && roleo.team != 4 && roleo.team != 3)
        {
            players[this.cardChoice].revealed = true;
        }
    }
}

class Curator extends Role
{
    name = "Curator";
    order = 11;
    team = 0;

    abstain = false;
    cardChoice;

    wake(x)
    {
        let out = "You may select a player to give a random token to, or type a to abstain";
        out += listPlayers(x);
        x.person.send(out);
    }
    response(x,y)
    {
        if(isNaN(y))
        {
            this.abstain = abstainPick(x,y);
            if(!this.abstain){return false;};
            return true;
        }

        if(!validPlayer(x,y)){return false;}

        this.cardChoice = y;
        return true;
    }
    resolve(x)
    {
        if(!this.abstain)
        {
            giveToken(players[this.cardChoice]);
            x.person.send("Token given.");
        }
    }
}

//non wake
class DreamWolf extends Role
{
    name = "Dream Wolf";
    order = -1;
    team = 1;

    wake(x)
    {
        let out = "You are on the werewolf team and are trying to either get a villager shot or your minion. You do not wake up. Type anything to continue.";
        x.person.send(out);
    }
}

class Hunter extends Role
{
    name = "Hunter";
    order = -1;
    team = 0;
    wake(x)
    {
        x.person.send("Whoever you vote for will die if you die. Type anything to continue.");
    }
}

class Villager extends Role
{
    name = "Villager";
    order = -1;
    team = 0;
    wake(x)
    {
        x.person.send("You are on the village team. You do nothing. Type anything to continue.");
    }
}

class Tanner extends Role
{
    name = "Tanner";
    order = -1;
    team = 4;
    wake(x)
    {
        x.person.send("You want to die. Type anything to continue.");
    }
}


function searchTeam(x,y)
{
    let members = new Array();
    let num = 0;
    for(let i = 0; i < players.length; i++)
    {
        if(players[i].person != x)
        {
            if(players[i].role.team == y)
            {
                members[num] = players[i];
                num++;
            }
        }
    }
    return members;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

function listPlayers(x)
{
    let out = "";
    for(let k = 0; k <players.length;k++)
    {
        if(players[k] != x)
        {
            out+= "\n" + k + " - " + players[k].person.username;
            if(players[k].revealed)
            {
                out += " ::REVEALED:: "
                out += players[k].newRole.name;
            }
            if(players[k].hasToken)
            {
                out += " ::ARTIFACT::";
            }
            if(players[k].hasShield)
            {
                out += " ::SHIELD::";
            }
        }
    }
    return out;
}

function listMid()
{
    let out = "";
    out+="\nA - Middle Card 1";
    out+="\nB - Middle Card 2";
    out+="\nC - Middle Card 3";
    if(hasAlpha)
    {
        out += "\nD - Middle Card 4";
    }
    return out;
}

function validPlayer(x,y)
{
    if(y<0 || y>=players.length || players[y] == x)
    {
        x.person.send("Invalid response. Please select from the list");
        return false;
    }

    if(players[y].hasToken)
    {
        x.person.send("Invalid response. You may not select a player with an artifact");
        return false;
    }
    if(players[y].hasShield)
    {
        x.person.send("Invalid response. You may not select a player with a shield");
        return false;
    }

    return true;
}

function validMid(x,y)
{
    console.log(hasAlpha);
    console.log("_"+y+"_");
    switch(y)
    {
        case "A":
            return 0;
        case "B":
            return 1;
        case "C":
            return 2;
        case "D":
            if(hasAlpha)
                return 3;
            return -1;
        default:
            x.person.send("Invalid response. Remember to use capitals when selecting from the center");
            return -1;
    }
}

function abstainPick(x,y)
{
    if(y == "a")
    {

        return true;
    }
    x.person.send("Invalid response. Please select from the list");
    return false;
}

function giveToken(x)
{
    let pick = Math.floor(Math.random() * 6)
    x.hasToken = true;
    let out = "";
    let tokenName = "";
    switch(pick)
    {
        case 0:
            out = "You have been given the claw of the werewolf. You are now on the werewolf team.";
            tokenName = "Claw of the werewolf";
            break;
        case 1:
            out = "You have been given the brand of the villager. You are now on the villager team.";
            tokenName = "Brand of the villager";
            break;
        case 2:
            out = "You have been given the void of nothingness. It has no effect.";
            tokenName = "Void of nothingness";
            break;
        case 3:
            out = "You have been given the cudgel of the tanner. You are now a tanner.";
            tokenName = "Cudgel of the tanner";
            break;
        case 4:
            out = "You have been given the mask of muting. Please mute yourself for the duration of the game. You also may not type in the text chat.";
            tokenName = "Mask of muting";
            break;
        case 5:
            out = "You have been given the shroud of shame. You must leave the voice call. You may still communicate via text chat.";
            tokenName = "Shroud of shame";
            break;
    }

    x.person.send(out);
    x.token = tokenName;
}

function selfswap(x)
{
    if(x.hasShield)
    {
        x.person.send("You may not perform your action because you have a sheild token.");
        return true;
    }
    return false;
}