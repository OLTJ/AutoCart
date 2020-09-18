console.log('Script successfully executed.')
document.addEventListener('click', e => {tracking(e)});

const trackedPath: string[][][] = [];


//Tracks mouse actions in browser
const tracking = (event: any) => {
    const element = event.target;
    const identifiers: string[] = getIdentifiers(element, ['name', 'id', 'class']);
    const tag: string = getTag(element);
    const value: string = containsValue(element);
    trackedPath.push([[tag], identifiers, [value]])

    console.log(trackedPath);
    
    return 0
}

//Checks if path is valid.
const formatPath = (tag: string, identifiers: string[], value: string) => {
    return null
}

//Gets primary HTML tag
const getTag = (element) => {
    return element.tagName;
}

//Checks if element contains a value
const containsValue = (element) => {
    if(element.value){
        return element.value
    }

    return ''
}

//Gets element identifiers/attributes
const getIdentifiers = (element, desiredIdentifiers: string[]) => {
    let attributes: string[] = [];
    for(let identifier of desiredIdentifiers){
        try {
            if(element.getAttribute(identifier) != null){
                attributes.push(identifier, element.getAttribute(identifier));
            }
        } catch {
            continue
        }
    }

    return attributes
}