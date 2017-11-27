const TeamSnip = { 
    currentTeam : undefined,

    util : {
         uuid : function () {
                    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                    );
                  }
    }

};
/**
 * Class representing the team's roster of players. 
 */
class Roster {

    /**
     * Set the roster as an array of Players.
     */
    constructor () {
        this.roster = [];
    }

    isPlayerActive(playerId) {
        return this.findPlayer(playerId).archived;
    } 
    
    isNumberTaken(number) {
        for (let i = 0; i < this.roster.length; i++) {
            if (!this.roster[i].archived && (this.roster[i].number === number))
                return true;
        }      
        return false;
    }
    
    addPlayer(name, number, position) {
        let player = new Player(name, number, position);
        this.roster.push(player);
    }

    editPlayer(playerId, name, number, position) {
        let player = this.findPlayer(playerId);
        player.edit(name, number, position);   
    }

    findPlayer(playerId) {
        let len = this.roster.length;
        for (let i = 0; i < len; i++) {
            if (this.roster[i].playerId === playerId) {
                return(this.roster[i]);
            }
        }
        return -1;
    }

    removePlayer(playerId) {
        let player = this.findPlayer(playerId);
        player.remove();        
    }

    get() {
        return this.roster; 
    }

    render() {
        
        let template = document.querySelector('#roster');
        
        let markup = '<ul>';
        for (let i=0, len = roster.length; i < len; i++) {
            markup += roster[i].render(); 
        }
        for (let i=0, len = TeamSnip.currentTeam.roster.length; i < len; i++) {
            markup += TeamSnip.currentTeam.roster[i].render(); 
        }
        markup += '</ul>';
    
        template.content.querySelector('#playerList').innerHTML = markup;
    
        let clonedTemplate = document.importNode(template.content, true);
        
        let view = document.querySelector('#view');
        view.innerHTML = "";
        view.appendChild(clonedTemplate); 
    
        document.querySelector('#addBtn').addEventListener('click', function () {
            TeamSnip.currentTeam.renderAddForm();
        }, false);

    
    }

    renderAddForm(playerId) {
        let template = document.querySelector('#playerFormTemplate'),
            clonedTemplate = document.importNode(template.content, true),
            view = document.querySelector('#view');

        

        view.innerHTML = "";
        view.appendChild(clonedTemplate); 

        if (playerId) {
            let player = TeamSnip.currentTeam.findPlayer(playerId);
            
            document.querySelector('#playerName').value = player.name;
            document.querySelector('#playerPosition').value = player.position;
            document.querySelector('#playerNumber').value = player.number;
            document.querySelector('#addPlayerBtn').setAttribute('data-action','edit');
            document.querySelector('#addPlayerBtn').setAttribute('data-playerid',playerId);
        }
        
        document.querySelector('#addPlayerBtn').addEventListener('click', function () {
            
            let name, position, number,playerId;

            name = document.querySelector('#playerName').value;
            position = document.querySelector('#playerPosition').value;
            number = document.querySelector('#playerNumber').value;
            playerId = document.querySelector('#addPlayerBtn').getAttribute('data-playerid');

            if (playerId) {
            TeamSnip.currentTeam.editPlayer(playerId,name,number,position);
            } else {
            TeamSnip.currentTeam.addPlayer(name,number,position);
            }
            
            TeamSnip.currentTeam.render();
        }, false);

        document.querySelector('#cancelPlayerBtn').addEventListener('click', function () {
            TeamSnip.currentTeam.render();
        }, false);
    }

}
        
class Player {
    
    constructor (name,number,position = 'Not assigned') {
        this.playerId = TeamSnip.util.uuid();
        this.name = name;
        this.number = number;
        this.position = position;
        this.archived = false;
    }

    edit(name, number, position) {
        this.name = name;
        this.number = number;
        this.position = position;
    }

    remove() {
        this.archived = true;
    }

    restore() {
        this.archived = false;
    }

    get() {
        if (!this.archived) {
            return {
            id : this.playerId,
            name : this.name,
            number : this.number,
            position : this.position
            };
        }
    }

    render() {
        let MARKUP = '';
        if (!this.archived) {
        MARKUP = `<li class="player btn">
            ${this.name} # ${this.number}
            <br>
            <strong>${this.position}</strong>
            <div class="recordControls">
            [ <span class="editBtn" onclick="TeamSnip.currentTeam.renderAddForm(this.id)" id="${this.playerId}">Edit</span> 
            ] &nbsp;&nbsp; [
            <span class="editBtn" onclick="TeamSnip.currentTeam.removePlayer(this.id); TeamSnip.currentTeam.render()" id="${this.playerId}">Delete</span> 
            ] &nbsp;&nbsp; [
            <a href="player.html">view info</a>
            ]
            </div>
            </li>`;
        }
        return MARKUP;
    } 
        
} /* Player */
roster = [];
var player = new Player('ABC', '123', 'Goalkeeper');
roster.push(player);


function render() {
    
    let template = document.querySelector('#roster');

    let markup = '<ul>';
    for (let i=0, len = roster.length; i < len; i++) {
        markup += roster[i].render(); 
    }
    for (let i=0, len = TeamSnip.currentTeam.roster.length; i < len; i++) {
        markup += TeamSnip.currentTeam.roster[i].render(); 
    }
    markup += '</ul>';

    template.content.querySelector('#playerList').innerHTML = markup;

    let clonedTemplate = document.importNode(template.content, true);
   
    let view = document.querySelector('#view');
    view.innerHTML = "";
    view.appendChild(clonedTemplate); 

    document.querySelector('#addBtn').addEventListener('click', function () {
       TeamSnip.currentTeam.renderAddForm();
    }, false);

   
   }


window.addEventListener('DOMContentLoaded', function () {
    
    // test basic roster
    for(let i = 0; i < roster.length; i++) {
        console.log(roster[i]);
    }

    TeamSnip.currentTeam = new Roster();
    //testRoster = new Roster();
    for (let i = 0; i < store.roster.length; i++) {
        TeamSnip.currentTeam.addPlayer(store.roster[i].name,store.roster[i].number,store.roster[i].position);
    }

    for(let i = 0; i < TeamSnip.currentTeam.roster.length; i++) {
        console.log(TeamSnip.currentTeam.roster[i]);
    }
    
    // create the team
    // TeamSnip.currentTeam = new Team(store.teamname);
    // for (let i = 0; i < store.roster.length; i++) {
    //     TeamSnip.currentTeam.addPlayer(store.roster[i].name,store.roster[i].number,store.roster[i].position);
    // }

    // // bind the nav handlers
    // document.querySelector('#rosterNav').addEventListener('click', function () { TeamSnip.currentTeam.renderRoster(); }, false);
    // document.querySelector('#scheduleNav').addEventListener('click', function ()  { TeamSnip.currentTeam.renderSchedule(); }, false);
    // document.querySelector('#statsNav').addEventListener('click', function () { TeamSnip.currentTeam.renderStats(); }, false);


}, false);