
class TickerUpdater{

    constructor(updateInterval) {
        this.x = 0;
        this.updating = false;
        this.updateInterval = updateInterval;

        //put set-up logic here

        this.startUpdating();
    }

    startUpdating(){
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

    update(){
        const d = new Date();
        let hour = d.getHours();
        let mins = d.getMinutes();
        let secs = d.getSeconds();
        this.x++;
        document.getElementById("time").innerHTML = this.format(hour, mins, secs);
    }

    format(hrs, mns){

            return (this.timeformat(hrs) + ":" + this.timeformat(mns));

    }

    timeformat(input){
        const inputnum = Number(input);
        if(inputnum < 10){
            return ("0" + inputnum.toString());
        }else{
            return inputnum.toString();
        }
    }

}



/*
async move()
{
    i = 0;
    while (true) {
        i++;
        document.getElementById('ticker').style.left(i);
    }
}
*/
