/**
 * Created by Юлия on 19.10.2019.
 */
let gridValues = [];

function printPlayground(){
    let number = parseInt(document.getElementById('number').value);
    // minimum field size
    if (number < 2) return;
    // hide input
    document.getElementById('choose-level').className = 'hidden';
    let playground = document.getElementById('playground');
    // reset playground
    playground.className = '';
    playground.innerHTML = '';
    for (let i = 0; i<number; i++) {
        if (!gridValues[i]) {
            //set string array if it doesn't exist
            gridValues[i] = [];
        }
        // create string
        let stringEl = document.createElement('tr');
        for (let j = 0; j<number; j++) {
            // create cell
            let cellEl = document.createElement('td');
            // define random color
            const random = Math.floor(Math.random()*2);
            // set random value
            gridValues[i][j] = random;
            // fill cell by color
            cellEl.className = random ? 'black' : 'white';
            // add click listener to cell
            cellEl.addEventListener('click', onCellClick);
            // insert cell to string
            stringEl.appendChild(cellEl);
        }
        // insert string to playground
        playground.appendChild(stringEl);
    }
}

function onCellClick(event) {
    // get cells
    const columnElems = [...event.target.parentElement.children];
    // get strings
    const rawElems = [...event.target.parentElement.parentElement.children];
    // get clicked column index
    const x = columnElems.indexOf(event.target);
    // get clicked row index
    const y = rawElems.indexOf(event.target.parentElement);

    // revers colors of clicked cell and it's neighbors
    if (rawElems[y].children[x]) reverseColor(rawElems, y, x);
    if (rawElems[y].children[x+1]) reverseColor(rawElems, y, x+1);
    if (rawElems[y].children[x-1]) reverseColor(rawElems, y, x-1);
    if (rawElems[y+1]) reverseColor(rawElems, y+1, x);
    if (rawElems[y-1]) reverseColor(rawElems, y-1, x);

    // check if all colors in string are the same in each string
    let resByString = [];
    let selectedColor = gridValues[0][0];
    gridValues.forEach(string => {
        resByString.push(string.every(item => item === selectedColor));
    });

    // check if all colors the same
    let res = resByString.every(item => item === true);

    // if all color the same, show congratulations
    if (res) {
        document.getElementById('playground').className = 'hidden';
        document.getElementById('congrats').className = '';
    }

}

function reverseColor(els, string, col) {
    // get element by indexes
    const el = els[string].children[col];
    // revers value
    gridValues[string][col] = gridValues[string][col] === 1 ? 0 : 1;
    // revers color
    el.className = el.className === 'black' ? 'white' : 'black';
}

function start() {
    // show input
    document.getElementById('choose-level').className = '';
    // hide congratulations
    document.getElementById('congrats').className = 'hidden';
}
