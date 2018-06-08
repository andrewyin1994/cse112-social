// main.js
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
     * Class Team defines the team name, roster and schedule
     */
    class Team {

        constructor (teamName) {
            this.name = teamName;
            this.roster = new Roster();
            this.schedule = new Schedule();
            this.teamStats = new Stats();
        }

        addPlayer(name, number, position) {
            this.roster.addPlayer(name, number, position);
        }

        findPlayer(playerId) {
            this.roster.findPlayer(playerId);
        }

        editPlayer(playerId, name, number, position) {
            this.roster.editPlayer(playerId, name, number, position);
        }

        removePlayer(playerId) {
            this.roster.removePlayer(playerId);
        }

        renderRoster() {
            this.roster.render();
        }

        renderSchedule() {
            this.schedule.render();
        }

        renderStats() {
            this.teamStats.render();
        }    
    }

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
          for (let i=0, len = this.roster.length; i < len; i++) {
            markup += this.roster[i].render(); 
          }
         markup += '</ul>';

         template.content.querySelector('#playerList').innerHTML = markup;

         let clonedTemplate = document.importNode(template.content, true);
        
         let view = document.querySelector('#view');
         view.innerHTML = "";
         view.appendChild(clonedTemplate); 

         document.querySelector('#addBtn').addEventListener('click', function () {
            TeamSnip.currentTeam.roster.renderAddForm();
         }, false);

        
        }

        renderAddForm(playerId) {
            let template = document.querySelector('#playerFormTemplate'),
                clonedTemplate = document.importNode(template.content, true),
                view = document.querySelector('#view');

            

            view.innerHTML = "";
            view.appendChild(clonedTemplate); 

            if (playerId) {
                let player = TeamSnip.currentTeam.roster.findPlayer(playerId);
               
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
              
              TeamSnip.currentTeam.renderRoster();
            }, false);
 
            document.querySelector('#cancelPlayerBtn').addEventListener('click', function () {
                TeamSnip.currentTeam.renderRoster();
            }, false);
        }

    }

   
   /**
    * Class Player defines a player on the soccer team.  
    * Currently supports basic properties could extend with
    * pictures and such.
    */
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
            MARKUP = `<li class="player">${this.name} # ${this.number} <br>
                             <strong>${this.position}</strong>
                             <div class="recordControls">
                              [ <span class="editBtn" onclick="TeamSnip.currentTeam.roster.renderAddForm(this.id)" id="${this.playerId}">Edit</span> 
                              ] &nbsp;&nbsp; [
                              <span class="editBtn" onclick="TeamSnip.currentTeam.removePlayer(this.id); TeamSnip.currentTeam.renderRoster()" id="${this.playerId}">Delete</span> 
                              ]
                              </div>
                            </li>`;
            }  
          return MARKUP;
        } 
           
    } /* Player */


    /**
     * Class representing the team's schedule of games, practices
     * and other events
     */
     class Schedule {
      
      /**
       *  Define the schedule.  Just an array will be ordered by add
       *  but generally shown in date or type order
       */  
      constructor ()  {
        this.schedule = [];
      }

      render() {
        let template = document.querySelector('#schedule');

        let clonedTemplate = document.importNode(template.content, true);        
        
        let view = document.querySelector('#view');
        view.innerHTML = "";
        view.appendChild(clonedTemplate); 
      }

    } /* Schedule */


    /**
     *  Class Stats will contain all the statistics for the team and player.
     *  Methods limited due to nature of the app.
     */
    class Stats {
        constructor() {
            this.stats = [];
        }

        render() {

          let template = document.querySelector('#stats');

          let clonedTemplate = document.importNode(template.content, true);        
        
          let view = document.querySelector('#view');
          view.innerHTML = "";
          view.appendChild(clonedTemplate); 
        }
    } /* Stats */
   


    window.addEventListener('DOMContentLoaded', function () {

        // create the team
        TeamSnip.currentTeam = new Team(store.teamname);
        for (let i = 0; i < store.roster.length; i++) {
            TeamSnip.currentTeam.addPlayer(store.roster[i].name,store.roster[i].number,store.roster[i].position);
        }

        // bind the nav handlers
        document.querySelector('#rosterNav').addEventListener('click', function () { TeamSnip.currentTeam.renderRoster(); }, false);
        document.querySelector('#scheduleNav').addEventListener('click', function ()  { TeamSnip.currentTeam.renderSchedule(); }, false);
        document.querySelector('#statsNav').addEventListener('click', function () { TeamSnip.currentTeam.renderStats(); }, false);


    }, false);