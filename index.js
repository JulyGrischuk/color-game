let start = function() {
    document.getElementById('choose-level').className = 'hidden';
    let input = document.getElementById('number');
    let startModel = new StartModel(input);

    let playground = document.getElementById('playground');
    let congratulations = document.getElementById('congrats');

    let gridView = new GridView(playground, congratulations);
    let gridModel = new GridModel();

    let controller = new GameController(gridView, gridModel);

    controller.activateGame(startModel.number);
};

let restart = function() {
    // show input
    document.getElementById('choose-level').className = '';
    // hide congratulations
    document.getElementById('congrats').className = 'hidden';

};


let StartModel = function(element) {
    this.number = parseInt(element.value);
};

let GridView = function (playground, congratulations) {
    this.playground = playground;
    this.congratulations = congratulations;
    this.onCellClick = null;
};

GridView.prototype.reset = function () {
    this.playground.className = '';
    this.playground.innerHTML = '';
};

GridView.prototype.print = function (data) {
    let length = data.length;

    for (let i = 0; i<length; i++) {
        // create string
        let stringEl = document.createElement('tr');
        for (let j = 0; j<length; j++) {
            // create cell
            let cellEl = document.createElement('td');
            cellEl.className = data[i][j] ? 'black' : 'white';
            // add click listener to cell
            cellEl.addEventListener('click', this.onCellClick);
            // insert cell to string
            stringEl.appendChild(cellEl);
        }
        // insert string to playground
        this.playground.appendChild(stringEl);
    }
};

GridView.prototype.showCongratulations = function() {
    this.playground.className = 'hidden';
    this.congratulations.className = '';
};

let GridModel = function() {
    this.gridValues = [];
};

GridModel.prototype.init = function(number) {
    for (let i = 0; i<number; i++) {
        if (!this.gridValues[i]) {
            //set string array if it doesn't exist
            this.gridValues[i] = [];
        }
        for (let j = 0; j<number; j++) {
            this.gridValues[i][j] = 1;
            this.randomColoring(number);
        }
    }
};

GridModel.prototype.randomColoring = function(number) {
    let amount = Math.floor(Math.random()*50);
    for (let i = 0; i < amount; i++) {
        let string = Math.floor(Math.random() * number);
        let col = Math.floor(Math.random() * number);
        this.onCellClick(string, col);
    }
};

GridModel.prototype.onCellClick = function (string, col) {
    this.reverseColor( string, col);
    this.reverseColor( string, col+1);
    this.reverseColor( string, col-1);
    this.reverseColor(string+1, col);
    this.reverseColor(string-1, col);
};

GridModel.prototype.reverseColor = function(string, col) {
    if (this.gridValues[string] === undefined || this.gridValues[string][col] === undefined) return;
    this.gridValues[string][col] = this.gridValues[string][col] === 1 ? 0 : 1;
};

GridModel.prototype.checkWin = function() {
    // check if all colors in string are the same in each string
    let resByString = [];
    let selectedColor = this.gridValues[0][0];
    this.gridValues.forEach(string => {
        resByString.push(string.every(item => item === selectedColor));
    });

    // check if all colors the same
    let res = resByString.every(item => item === true);

    return res;
};

let GameController = function (gridView, gridModel) {
    this.gridView = gridView;
    this.gridModel = gridModel;
    this.onCellClick = function (event) {
        let element = event.target;
        // get cells
        const columnElems = [...element.parentElement.children];
        // get strings
        const rawElems = [...element.parentElement.parentElement.children];
        // get clicked column index
        const col = columnElems.indexOf(element);
        // get clicked row index
        const string = rawElems.indexOf(element.parentElement);

        this.gridModel.onCellClick(string, col);
        this.gridView.reset();
        this.gridView.print(gridModel.gridValues);

        if (this.gridModel.checkWin()) {
            this.gridView.showCongratulations();
        }
    };
    this.gridView.onCellClick = this.onCellClick.bind(this);

    this.activateGame = function (number) {
        this.gridModel.init(number);
        this.gridView.reset();
        this.gridView.print(this.gridModel.gridValues);
    };
};

