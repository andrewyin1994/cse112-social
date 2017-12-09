const TeamSnip = { currentEventFeed : undefined };

firestore = firebase.firestore();

const docRef = firestore.doc("roster/players");
const docRef2 = firestore.doc("plays/events");

class EventFeed {

    constructor() {
        this.events = [];     
    }

    addEvent(name,eventType) {
        let event = new Event(name,eventType);
        TeamSnip.currentEventFeed.events.push(event);
        console.log(name, eventType);
    }

    render() {
        console.log(TeamSnip.currentEventFeed.events.length);
        let template = document.querySelector('#events');
        let markup = "<ul>";
        for (let i=0, len = TeamSnip.currentEventFeed.events.length; i < len; i++) {
            markup += TeamSnip.currentEventFeed.events[i].render(); 
        }
        markup += '</ul>';

        template.content.querySelector('#eventList').innerHTML = markup;
    
        let clonedTemplate = document.importNode(template.content, true);
        
        let view = document.querySelector('#view');
        view.innerHTML = "";
        view.appendChild(clonedTemplate);
    }
}

class Event {

    constructor(name, event) {
        this.name = name;
        this.event = event;
    }

    render() {
        let MARKUP = '';
        if (!this.archived) {
        MARKUP = `<li class="event btn">
            ${this.name}, ${this.event}
            </li>`;
        }
        return MARKUP;
    }
}

function submitEvent() {
    var e = document.getElementById('event_types');
    var eToAdd = e.options[e.selectedIndex].value;
    var n = document.getElementById('player_name');
    var nToAdd = n.options[n.selectedIndex].textContent;
    var pId = n.options[n.selectedIndex].id;
    console.log(nToAdd, eToAdd);
    TeamSnip.currentEventFeed.addEvent(nToAdd,eToAdd);
    TeamSnip.currentEventFeed.render();

    // update player stats
    var out = JSON.parse(window.localStorage['roster']);
    if(eToAdd == 'Goal') {
        for(let i = 0; i < out.length; i++) {
            if(out[i].playerId == pId) {
                out[i].goals++;
            }
        }
    }

    window.localStorage['roster'] = JSON.stringify(out);
    docRef.set({roster:window.localStorage['roster']});
    
    window.localStorage['events'] = JSON.stringify(TeamSnip.currentEventFeed.events);
    docRef2.set({plays:window.localStorage['events']});
}

window.addEventListener('DOMContentLoaded', function() {
    //read in from localStorage
    if(!navigator.onLine) {
        var p = JSON.parse(window.localStorage['roster']);
        let markup = '';
        for (let i = 0; i < p.length; i++) {
            markup += "<option id=" + p[i].playerId + ">" + p[i].name + "</option>";
        } 
        document.querySelector("#player_name").innerHTML = markup;
    }
    else {
        docRef.get().then(function(doc) {
            if (doc && doc.exists) {
                const playerData = doc.data().roster;
                window.localStorage['roster'] = playerData;
                var p = JSON.parse(playerData);   
                let markup = '';
                for (let i = 0; i < p.length; i++) {
                    //TeamSnip.currentRoster.addPlayer(out[i].name,out[i].number,out[i].position);
                    markup += "<option id=" + p[i].playerId + ">" + p[i].name + "</option>";
                } 
                document.querySelector("#player_name").innerHTML = markup;
            }
            else {
                console.log("NO DOC");
            }
        })
        .catch(function(err) {
            console.log("Error: ", err);
        });
    }
    
    TeamSnip.currentEventFeed = new EventFeed();    
    if(!navigator.onLine) {
        if(window.localStorage['events']) {
            var e = JSON.parse(window.localStorage['events']);
            for(let i=0; i < e.length; i++) {
                TeamSnip.currentEventFeed.addEvent(e[i].name,e[i].event);
            }
        }
        TeamSnip.currentEventFeed.render();
    }
    else {
        docRef2.get().then(function(doc) {
            if (doc && doc.exists) {
                const eventData = doc.data().plays;
                window.localStorage['events'] = eventData;
                var e = JSON.parse(eventData);
                for(let i=0; i < e.length; i++) {
                    TeamSnip.currentEventFeed.addEvent(e[i].name,e[i].event);
                }                    
            }
            else {
                console.log("NO DOC");
            }
        })
        .catch(function(err) {
            console.log("Error: ", err);
        });
        TeamSnip.currentEventFeed.render();        
    }
}
, false);