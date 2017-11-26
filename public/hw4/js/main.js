/*
Goal:
Add functionality for at least 5 features:
1) login
2) logout
3) scheduling
4) roster
5) statistics

useful:
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
use localStorage, which is a built-in object in the browser/webAPI/ that allows you to store key value pairs,
use it to store arrays of objects or whatever kind of data you need
(key k: value v, v can be any kind of thing, even an array[]) 
sessionStorage is stored until the browser session ends
*/

function clearStorage() {
    window.localStorage.clear();
    return true;
}

function test() {
    //show current localStorage
    console.log(window.localStorage);
    
    //example in appending
    var tmp = {'usr': 'pwd'};
    console.log(tmp);
    tmp['dog']='cat';
    console.log(tmp);
    
    
    window.localStorage['login'] = JSON.stringify(tmp);
    console.log(window.localStorage['login']);
    var out = JSON.parse(window.localStorage['login']);
    console.log(tmp);
}

function test2() {
    //grab the current username and password
    usr = document.loginForm.user.value;
    pwd = document.loginForm.password.value;
    if(usr=='usr') {
        window.location.href = "team.html";
        return true;
    }
    else {
        console.log("wrong");
        //alert("wrong");
        return false;
    }
   
}

function verifyLogin() {
    //grab the current username and password
    usr = document.loginForm.user.value;
    pwd = document.loginForm.password.value;
    if(usr=='usr') {
        if(pwd=='pwd'){
            window.location.href = "team.html";
            return true;
        }
        return false;
    }
    else {
        console.log("wrong");
        //alert("wrong");
        return false;
    }
    
}


function logOut() {
    /* TODO */
    return false;
}

function handleSchedule() {
    /* TODO */
    return false;
}

function createRoster() {
    /* TODO */
    return false;
}

function appendRoster() {
    /* TODO */
    return false;
}

function handleStatistics(){
    /* TODO */
    return false;
}

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
                MARKUP = `<li class="player">
                
                ${this.name} # ${this.number}
                <br>
                <strong>${this.position}</strong>
                <div class="recordControls">
                [ <span class="editBtn" onclick="TeamSnip.currentTeam.roster.renderAddForm(this.id)" id="${this.playerId}">Edit</span> 
                ] &nbsp;&nbsp; [
                <span class="editBtn" onclick="TeamSnip.currentTeam.removePlayer(this.id); TeamSnip.currentTeam.renderRoster()" id="${this.playerId}">Delete</span> 
                ]
                ] &nbsp;&nbsp; [
                <a href="player.html">view info</a>
                ]
                </div>
                </li>`;
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
    markup += '</ul>';

    template.content.querySelector('#playerList').innerHTML = markup;

    let clonedTemplate = document.importNode(template.content, true);
   
    let view = document.querySelector('#view');
    view.innerHTML = "";
    view.appendChild(clonedTemplate); 

    // document.querySelector('#addBtn').addEventListener('click', function () {
    //    TeamSnip.currentTeam.roster.renderAddForm();
    // }, false);

   
   }