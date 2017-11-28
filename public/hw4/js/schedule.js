const TeamSnip = {
    currentSchedule : undefined
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
        window.localStorage['roster'] = JSON.stringify(TeamSnip.currentRoster.roster);
    }

    editPlayer(playerId, name, number, position) {
        let player = this.findPlayer(playerId);
        player.edit(name, number, position);
        window.localStorage['roster'] = JSON.stringify(TeamSnip.currentRoster.roster);
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
        window.localStorage['roster'] = JSON.stringify(TeamSnip.currentRoster.roster);
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
        for (let i=0, len = TeamSnip.currentRoster.roster.length; i < len; i++) {
            markup += TeamSnip.currentRoster.roster[i].render();
        }
        markup += '</ul>';

        template.content.querySelector('#playerList').innerHTML = markup;

        let clonedTemplate = document.importNode(template.content, true);

        let view = document.querySelector('#view');
        view.innerHTML = "";
        view.appendChild(clonedTemplate);

        document.querySelector('#addBtn').addEventListener('click', function () {
            TeamSnip.currentRoster.renderAddForm();
        }, false);

    }

    renderAddForm(playerId) {
        let template = document.querySelector('#playerFormTemplate'),
            clonedTemplate = document.importNode(template.content, true),
            view = document.querySelector('#view');


        view.innerHTML = "";
        view.appendChild(clonedTemplate);

        if (playerId) {
            let player = TeamSnip.currentRoster.findPlayer(playerId);

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
            TeamSnip.currentRoster.editPlayer(playerId,name,number,position);
            } else {
            TeamSnip.currentRoster.addPlayer(name,number,position);
            }

            TeamSnip.currentRoster.render();
        }, false);

        document.querySelector('#cancelPlayerBtn').addEventListener('click', function () {
            TeamSnip.currentRoster.render();
        }, false);
    }

    renderStats(playerId) {
        let template = document.querySelector('#playerStatTemplate'),
        clonedTemplate = document.importNode(template.content, true),
        view = document.querySelector('#view');


        view.innerHTML = "";
        view.appendChild(clonedTemplate);

        if (playerId) {
            let player = TeamSnip.currentRoster.findPlayer(playerId);
            document.querySelector('#playerName').innerHTML = player.name;
            document.querySelector('#goals').innerHTML = 'Goals: ' + player.goals;
            document.querySelector('#sog').innerHTML = 'Shots on Goal: ' + player.sog;
            document.querySelector('#gkicks').innerHTML = 'Goal Kicks: ' + player.gkicks;
            document.querySelector('#ckicks').innerHTML = 'Corner Kicks: ' + player.ckicks;
            document.querySelector('#fouls').innerHTML = 'Fouls: ' + player.fouls;
            document.querySelector('#ycards').innerHTML = 'Yellow Cards: ' + player.ycards;
            document.querySelector('#rcards').innerHTML = 'Red Cards: ' + player.rcards;
        }
        document.querySelector('#cancelPlayerBtn').addEventListener('click', function () {
            TeamSnip.currentRoster.render();
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
        this.goals = 0;
        this.sog = 0;
        this.gkicks = 0;
        this.ckicks = 0;
        this.fouls = 0;
        this.ycards = 0;
        this.rcards = 0;
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
            [
                <span class="editBtn" onclick="TeamSnip.currentRoster.renderAddForm(this.id)" id="${this.playerId}">Edit</span>
            ] &nbsp;&nbsp; [
                <span class="editBtn" onclick="TeamSnip.currentRoster.removePlayer(this.id); TeamSnip.currentRoster.render()" id="${this.playerId}">Delete</span>
            ] &nbsp;&nbsp; [
                <span class="editBtn" onclick="TeamSnip.currentRoster.renderStats(this.id)" id="${this.playerId}">View Info</span>
            ]
            </div>
            </li>`;
        }
        return MARKUP;
    }


} /* Player */



function render() {

    let template = document.querySelector('#roster');

    let markup = '<ul>';
    // for (let i=0, len = roster.length; i < len; i++) {
    //     markup += roster[i].render();
    // }
    for (let i=0, len = TeamSnip.currentRoster.roster.length; i < len; i++) {
        markup += TeamSnip.currentRoster.roster[i].render();
    }
    markup += '</ul>';

    template.content.querySelector('#playerList').innerHTML = markup;

    let clonedTemplate = document.importNode(template.content, true);

    let view = document.querySelector('#view');
    view.innerHTML = "";
    view.appendChild(clonedTemplate);

    document.querySelector('#addBtn').addEventListener('click', function () {
       TeamSnip.currentRoster.renderAddForm();
    }, false);


}

function reload() {
    for (let i = 0; i < TeamSnip.currentRoster.roster.length; i++) {
        if(TeamSnip.currentRoster.roster[i].archived == true)
            TeamSnip.currentRoster.roster[i].archived = false;
    }
}

window.addEventListener('DOMContentLoaded', function () {
    if(window.localStorage['loaded']) {
        console.log(window.localStorage['loaded']);
        var out = JSON.parse(window.localStorage['roster']);
        console.log(out);
        TeamSnip.currentRoster = new Roster();
        for (let i = 0; i < out.length; i++) {
            TeamSnip.currentRoster.addPlayer(out[i].name,out[i].number,out[i].position);
            // console.log(out[i].name,out[i].number,out[i].position);
        }
        TeamSnip.currentRoster.render();
    }
    else {
        TeamSnip.currentRoster = new Roster();;
        for (let i = 0; i < store.roster.length; i++) {
            TeamSnip.currentRoster.addPlayer(store.roster[i].name,store.roster[i].number,store.roster[i].position);
        }

        // for(let i = 0; i < TeamSnip.currentRoster.roster.length; i++) {
        //     console.log(TeamSnip.currentRoster.roster[i]);
        // }

        window.localStorage['loaded'] = true;
        window.localStorage['roster'] = JSON.stringify(TeamSnip.currentRoster.roster);
        console.log(window.localStorage['roster']);
        TeamSnip.currentRoster.render();
    }
}, false);
