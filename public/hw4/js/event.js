class EventFeed {

    constructor() {
        this.events = [];     
    }

    addEvent(name,eventType) {
        let event = new Event(name,eventType);
        this.events.push(event);
    }


}

class Event {

    constructor(name, event) {
        this.name = name;
        this.event = event;
    }
}

window.addEventListener('DOMContentLoaded', function() {
    //read in from localStorage
}
, false);