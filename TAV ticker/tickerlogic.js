class tickerlogic {

    items
    itemSpacing
    noOfItems
    updating
    updateInterval

    constructor() {
        this.items = [];
        this.itemSpacing = 50;
        this.noOfItems = 0;
        this.updating = false;
        this.updateInterval = 100;
    }

    async update(){

    }

    startUpdating() {
        if(!this.updating){
            this.update();
            setInterval(this.update.bind(this), this.updateInterval);
            this.updating = true;
        }
    }

    updateItems(newItems){
        this.items = newItems;
    }
}