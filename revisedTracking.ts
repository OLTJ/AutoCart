//Path format [[['SPAN'], ['class', 'Egenskap1', 'name', 'testing'], ['NONE']], [['SPAN'], ['class', 'Egenskap1', 'name', 'testing'], ['NONE']]]

class Tracker {
    tempStorage: string[][][] = [];
    identifierCriteria: string[];
    constructor(identifierCriteria: string[]){
        this.identifierCriteria = identifierCriteria;
    }

    track(eventTarget: any){
        const tag: string = this.fetchTag(eventTarget);
        const identifiers: string[] = this.fetchIdentifiers(eventTarget);
        const value: string = this.fetchValue(eventTarget);
        //Pushes formatted path step into tempStorage
        this.tempStorage.push([[tag], identifiers, [value]]);
    }

    fetchTag(eventTarget: any){
        let tag: string = eventTarget.tagName;
        return tag
    }

    fetchValue(eventTarget: any){ //REWRITE LATER
        if(eventTarget.value){
            return eventTarget.value
        }
        return 'NONE'
    }

    fetchIdentifiers(eventTarget: any){ //REWRITE LATER
        //Temp identifier storage
        let identifiers: string[] = [];

        //Iterates through identifiers within identifierCriteria and if identifier exists - appends to identifiers
        for(let identifier of this.identifierCriteria){
            try {
                if(eventTarget.getAttribute(identifier) != null){
                    identifiers.push(identifier, eventTarget.getAttribute(identifier));
                }
            } catch {
                continue
            }
        }

        return identifiers
    }
}

//Notifies if tracking script has been injected.
console.log('Tracking script was injected.');

//Initializes tracker
const T = new Tracker(['name', 'id', 'class']);

//Injects a mouse click event listener and calls the tracking function
document.addEventListener('click', function(event){T.track(event.target)});

export default Tracker;