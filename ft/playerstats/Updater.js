class GraphicsUpdater {
    constructor(settings, spreadsheetID, worksheetName, apiKey, updateInterval=3000, updateNow=true) {
        this.updating = false;
        const cellsNeeded = (() => {
            let cells = []
            for (let i of Object.values(settings)){
                for (let j of Object.keys(i)) {
                    cells.push(j.match(/[a-zA-Z]+|[0-9]+/g));
                }
            }
            return cells;
        })();
        const cellsNumeric = cellsNeeded.map(coords => [this.colToIndex(coords[0]), parseInt(coords[1])]);
        const cellRange = (() => {
            const cols = cellsNumeric.map(val => val[0])
            const rows = cellsNumeric.map(val => val[1]);
            return [
                Math.min(...cols),
                Math.min(...rows),
                Math.max(...cols),
                Math.max(...rows)
            ];
        })();
        const rangeText = `${this.indexToCol(cellRange[0])}${cellRange[1]}:${this.indexToCol(cellRange[2])}${cellRange[3]}`;
        this.url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${worksheetName}!${rangeText}?key=${apiKey}&majorDimension=COLUMNS&valueRenderOption=FORMATTED_VALUE`;
        this.arrayMap = (() => {
            let map = {};
            for (let i of Object.keys(settings)) {
                map[i] = {}
                for (let j of Object.keys(settings[i])) {
                    let coords = j.match(/[a-zA-Z]+|[0-9]+/g);
                    coords[0] = this.colToIndex(coords[0]);
                    coords = coords.map((v, i) => v - cellRange[i]);
                    map[i][coords.toString()] = settings[i][j];
                }
            }

            return map;
        })();
        this.simpleOperations = ['string', 'image'];
        this.operations = {
            'string': (id, cellValue) => document.getElementById(id).innerHTML = cellValue,
            'image': (id, cellValue) => document.getElementById(id).src = cellValue,
            'counter': (ids, cellValue) => {
                try {
                    cellValue = parseInt(cellValue);
                }
                catch (error) {
                    console.warn(`Failed to parse counter number '${cellValue.toString()}' for ID(s) '${ids.toString}' from spreadsheet: make sure it's a number!\nReceived the following error:\n${error.toString()}`);
                }
                for (let i = 0; i < cellValue; i++) {
                    document.getElementById(ids[i]).style.display = '';
                }
                for (let i = cellValue; i < ids.length; i++) {
                    document.getElementById(ids[i]).style.display = 'none';
                }
            },
            'switch': (valueSwitch, cellValue) => {
                for (let i of Object.keys(valueSwitch)) {
                    if (i == cellValue) {
                        document.getElementById(valueSwitch[i]).style.display = '';
                    }
                    else {
                        document.getElementById(valueSwitch[i]).style.display = 'none';
                    }
                }
            }
        }

        this.updateInterval = updateInterval;

        if (updateNow) {
            // Start updating the overlay
            this.startUpdating();
        }
    }

    async update() {
        // Get sheet data from Google Sheets API
        let cells;
        try {
            let response = await fetch(this.url);
            if (!response.ok) {
                throw 'Failed to find your spreadsheet! Make sure it\'s public and the given ID is correct.';
            }
            cells = await response.json();
        }
        catch (error) {
            throw 'Failed to access spreadsheet on Google Sheets API! Make sure your API key is correct, and enabled on the Google Sheets API.';
        }
        cells = cells.values;

        // Iterate over this.arrayMap, writing the received values into the overlay
        let coords, run;
        for (let type of Object.keys(this.arrayMap)) {
            // Okay this bit is pretty meta
            // When a new type is used, check if it's a simple operation
            if (this.simpleOperations.includes(type)) {
                // If it is a simple operation, put a check into the run function
                // to iterate over IDs if they're given in an array
                run = (ids, cellValue) => {
                    if (Array.isArray(ids)) {
                        for (let id of ids) {
                            this.operations[type](id, cellValue);
                        }
                    }
                    else {
                        this.operations[type](ids, cellValue)
                    }
                };
            }
            else {
                // If it's not a simple operation, just run the given function as normal
                run = (ids, cellValue) => this.operations[type](ids, cellValue);
            }

            // Once the run function has been defined for the type, iterate over the cells for that type
            // and use the operations defined in this.operations to write spreadsheet values to the overlay
            for (let locationString of Object.keys(this.arrayMap[type])) {
                coords = locationString.split(',').map(v => v.toString());

                const cellValue = (() => {
                    const col = cells[coords[0]];
                    if (col) {
                        const value = col[coords[1]];
                        if (typeof value === 'string') {
                            return col[coords[1]];
                        }
                    }
                    return '';
                })();

                try {
                    run(this.arrayMap[type][locationString], cellValue);
                }
                catch (error) {
                    console.warn(`Failed to update ${this.arrayMap[type][locationString].toString()} with value ${cellValue.toString()}!\nReceived the following error:\n${error.toString()}`);
                }
            }
        }
    }
    addOperation(name, operation, isSimple=false) {
        if (!(name in this.operations)) {
            this.operations[name] = operation;

            if (isSimple) {
                this.simpleOperations.push(name);
            }
        }
        else {
            console.warn(`Failed to add operation ${name} to operation structure - it already exists! Try a different name.`);
        }
    }
    importPreset(operationObject) {
        this.addOperation(...Object.values(operationObject));
    }

    startUpdating() {
        if (!this.updating) {
            // Start updating the overlay
            this.update();
            setInterval(this.update.bind(this), this.updateInterval);
            this.updating = true;
        }
        else {
            console.warn(`Failed to start updating: the updater is already updating!`);
        }
    }
    colToIndex(colString) {
        let base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;
        for (i = 0, j = colString.length - 1; i < colString.length; i += 1, j -= 1) {
            result += Math.pow(base.length, j) * (base.indexOf(colString[i]) + 1);
        }
        return result;
    }
    indexToCol(num) {
        for (var result = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
            result = String.fromCharCode(parseInt((num % b) / a) + 65) + result;
        }
        return result;
    }
}