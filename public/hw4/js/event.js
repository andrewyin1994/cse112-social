class EventFeed {

    constructor() {
        this.events = [];     
    }

    addEvent(name,eventType) {
        let event = new Event(name,eventType);
        this.events.push(event);
    }

    render() {
        console.log(events.length);
        let template = document.querySelector('#events');
        let markup = '<ul>';
        for (let i=0, len = events.length; i < len; i++) {
            markup += events[i].render(); 
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
            ${this.name} # ${this.name}
            <br>
            <strong>${this.name}</strong>
            </li>`;
        }
        return MARKUP;
    }

}

window.addEventListener('DOMContentLoaded', function() {
    //read in from localStorage
    let events = new EventFeed();
    console.log('hi');
    events.addEvent('Lionel Messi','Goal');
    events.render();
}
, false);