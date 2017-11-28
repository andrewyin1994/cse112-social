const TeamSnip = {
    currentEventFeed : undefined
};

class EventFeed {

    constructor() {
        this.events = [];     
    }

    addEvent(name,eventType) {
        let event = new Event(name,eventType);
        this.events.push(event);
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
    console.log(nToAdd, eToAdd);
    TeamSnip.currentEventFeed.addEvent(nToAdd,eToAdd);
    TeamSnip.currentEventFeed.render();
}

window.addEventListener('DOMContentLoaded', function() {
    //read in from localStorage
    if(window.localStorage['loaded']) {
        console.log(window.localStorage['loaded']);
        var out = JSON.parse(window.localStorage['roster']);
        let markup = '';
        for (let i = 0; i < out.length; i++) {
            // TeamSnip.currentRoster.addPlayer(out[i].name,out[i].number,out[i].position);
            // console.log(out[i].name,out[i].number,out[i].position);
            n = out[i].name;
            markup += "<option>" + n + "</option>";
        } 
        document.querySelector("#player_name").innerHTML = markup;
        
    }
    else {
        
    }
    
    TeamSnip.currentEventFeed = new EventFeed();
    TeamSnip.currentEventFeed.render();
}
, false);