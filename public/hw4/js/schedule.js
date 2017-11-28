const TeamSnip = {
<<<<<<< HEAD
    currentSchedule : undefined,
    util : {
         uuid : function () {
                    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                    );
                  }
    }


=======
    currentSchedule : undefined
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
};

/**
 * Class representing the team's roster of players.
 */
<<<<<<< HEAD
class Schedule {
=======
class Roster {
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c

    /**
     * Set the roster as an array of Players.
     */
    constructor () {
<<<<<<< HEAD
        this.schedule = [];
    }


    addSchedule(name, number, position) {
        let scheduleEl = new scheduleElement(name, number, position);
        this.schedule.push(scheduleEl);
        window.localStorage['schedule'] = JSON.stringify(TeamSnip.currentSchedule.schedule);
    }

    editSchedule(playerId, name, number, position) {
        let scheduleElement = this.findSchedule(playerId);
        scheduleElement.edit(name, number, position);
        window.localStorage['schedule'] = JSON.stringify(TeamSnip.currentSchedule.schedule);
    }

    findSchedule(playerId) {
        let len = this.schedule.length;
        for (let i = 0; i < len; i++) {
            if (this.schedule[i].playerId === playerId) {
                return(this.schedule[i]);
=======
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
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
            }
        }
        return -1;
    }

<<<<<<< HEAD
    removeSchedule(playerId) {
        let scheduleElement = this.findSchedule(playerId);
        scheduleElement.remove();
        window.localStorage['schedule'] = JSON.stringify(TeamSnip.currentSchedule.schedule);
    }

    get() {
        return this.schedule;
=======
    removePlayer(playerId) {
        let player = this.findPlayer(playerId);
        player.remove();
        window.localStorage['roster'] = JSON.stringify(TeamSnip.currentRoster.roster);
    }

    get() {
        return this.roster;
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
    }

    render() {

<<<<<<< HEAD
        let template = document.querySelector('#schedule');

        let markup = '<ul>';
        for (let i=0, len = schedule.length; i < len; i++) {
            markup += schedule[i].render();
        }
        for (let i=0, len = TeamSnip.currentSchedule.schedule.length; i < len; i++) {
            markup += TeamSnip.currentSchedule.schedule[i].render();
=======
        let template = document.querySelector('#roster');

        let markup = '<ul>';
        for (let i=0, len = roster.length; i < len; i++) {
            markup += roster[i].render();
        }
        for (let i=0, len = TeamSnip.currentRoster.roster.length; i < len; i++) {
            markup += TeamSnip.currentRoster.roster[i].render();
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
        }
        markup += '</ul>';

        template.content.querySelector('#playerList').innerHTML = markup;

        let clonedTemplate = document.importNode(template.content, true);

        let view = document.querySelector('#view');
        view.innerHTML = "";
        view.appendChild(clonedTemplate);

        document.querySelector('#addBtn').addEventListener('click', function () {
<<<<<<< HEAD
            TeamSnip.currentSchedule.renderAddForm();
=======
            TeamSnip.currentRoster.renderAddForm();
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
        }, false);

    }

    renderAddForm(playerId) {
        let template = document.querySelector('#playerFormTemplate'),
            clonedTemplate = document.importNode(template.content, true),
            view = document.querySelector('#view');


        view.innerHTML = "";
        view.appendChild(clonedTemplate);

        if (playerId) {
<<<<<<< HEAD
            let player = TeamSnip.currentSchedule.findSchedule(playerId);
=======
            let player = TeamSnip.currentRoster.findPlayer(playerId);
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c

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
<<<<<<< HEAD
            TeamSnip.currentSchedule.editSchedule(playerId,name,number,position);
            } else {
            TeamSnip.currentSchedule.addSchedule(name,number,position);
            }

            TeamSnip.currentSchedule.render();
        }, false);

        document.querySelector('#cancelPlayerBtn').addEventListener('click', function () {
            TeamSnip.currentSchedule.render();
        }, false);
=======
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

>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
    }

}

<<<<<<< HEAD
class scheduleElement {
=======
class Player {
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c

    constructor (name,number,position = 'Not assigned') {
        this.playerId = TeamSnip.util.uuid();
        this.name = name;
        this.number = number;
        this.position = position;
<<<<<<< HEAD
=======
        this.archived = false;
        this.goals = 0;
        this.sog = 0;
        this.gkicks = 0;
        this.ckicks = 0;
        this.fouls = 0;
        this.ycards = 0;
        this.rcards = 0;
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
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
<<<<<<< HEAD
            ${this.name}; Time: ${this.number}
=======
            ${this.name} # ${this.number}
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
            <br>
            <strong>${this.position}</strong>
            <div class="recordControls">
            [
<<<<<<< HEAD
                <span class="editBtn" onclick="TeamSnip.currentSchedule.renderAddForm(this.id)" id="${this.playerId}">Edit</span>
            ] &nbsp;&nbsp; [
                <span class="editBtn" onclick="TeamSnip.currentSchedule.removeSchedule(this.id); TeamSnip.currentSchedule.render()" id="${this.playerId}">Delete</span>
            ] &nbsp;&nbsp; [
                <span class="editBtn" onclick="TeamSnip.currentSchedule.renderStats(this.id)" id="${this.playerId}">View Info</span>
=======
                <span class="editBtn" onclick="TeamSnip.currentRoster.renderAddForm(this.id)" id="${this.playerId}">Edit</span>
            ] &nbsp;&nbsp; [
                <span class="editBtn" onclick="TeamSnip.currentRoster.removePlayer(this.id); TeamSnip.currentRoster.render()" id="${this.playerId}">Delete</span>
            ] &nbsp;&nbsp; [
                <span class="editBtn" onclick="TeamSnip.currentRoster.renderStats(this.id)" id="${this.playerId}">View Info</span>
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
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
<<<<<<< HEAD
    for (let i=0, len = TeamSnip.currentSchedule.schedule.length; i < len; i++) {
        markup += TeamSnip.currentSchedule.schedule[i].render();
=======
    for (let i=0, len = TeamSnip.currentRoster.roster.length; i < len; i++) {
        markup += TeamSnip.currentRoster.roster[i].render();
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
    }
    markup += '</ul>';

    template.content.querySelector('#playerList').innerHTML = markup;

    let clonedTemplate = document.importNode(template.content, true);

    let view = document.querySelector('#view');
    view.innerHTML = "";
    view.appendChild(clonedTemplate);

    document.querySelector('#addBtn').addEventListener('click', function () {
<<<<<<< HEAD
       TeamSnip.currentSchedule.renderAddForm();
=======
       TeamSnip.currentRoster.renderAddForm();
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
    }, false);


}

function reload() {
<<<<<<< HEAD
    for (let i = 0; i < TeamSnip.currentSchedule.schedule.length; i++) {
        if(TeamSnip.currentSchedule.schedule[i].archived == true)
            TeamSnip.currentSchedule.schedule[i].archived = false;
=======
    for (let i = 0; i < TeamSnip.currentRoster.roster.length; i++) {
        if(TeamSnip.currentRoster.roster[i].archived == true)
            TeamSnip.currentRoster.roster[i].archived = false;
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
    }
}

window.addEventListener('DOMContentLoaded', function () {
    if(window.localStorage['loaded']) {
        console.log(window.localStorage['loaded']);
<<<<<<< HEAD
        var out = JSON.parse(window.localStorage['schedule']);
        console.log(out);
        TeamSnip.currentSchedule = new Schedule();
        for (let i = 0; i < out.length; i++) {
            TeamSnip.currentSchedule.addSchedule(out[i].name,out[i].number,out[i].position);
            // console.log(out[i].name,out[i].number,out[i].position);
        }
        TeamSnip.currentSchedule.render();
    }
    else {
        TeamSnip.currentSchedule = new Schedule();;
        for (let i = 0; i < storeSchedule.roster.length; i++) {
            TeamSnip.currentSchedule.addSchedule(storeSchedule.roster[i].name,storeSchedule.roster[i].number,storeSchedule.roster[i].position);
=======
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
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
        }

        // for(let i = 0; i < TeamSnip.currentRoster.roster.length; i++) {
        //     console.log(TeamSnip.currentRoster.roster[i]);
        // }

        window.localStorage['loaded'] = true;
<<<<<<< HEAD
        window.localStorage['schedule'] = JSON.stringify(TeamSnip.currentSchedule.schedule);
        console.log(window.localStorage['roster']);
        TeamSnip.currentSchedule.render();
=======
        window.localStorage['roster'] = JSON.stringify(TeamSnip.currentRoster.roster);
        console.log(window.localStorage['roster']);
        TeamSnip.currentRoster.render();
>>>>>>> f57f55adeb60cd3e8e6e0062e5b0e19c099d5d2c
    }
}, false);
