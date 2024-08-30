
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
        document.getElementById("tickertime").innerHTML = this.format(hour, mins, secs);
    }

    format(hrs, mns){
        let backinbool = document.getElementById("backinbool").innerText;
        if(backinbool == "TRUE"){
            let timertime = document.getElementById('timertime').innerText;

            const givenhrs = timertime.split(':')[0];
            const givenmins = timertime.split(':')[1];
            const givensecs = timertime.split(':')[2];

            const now = new Date();
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), givenhrs, givenmins, givensecs, 0);
            const timediff = (now.getTime() - target.getTime()) * -1;
            const outtime = new Date(timediff);

            if(outtime.getMinutes() > 55){
                return "00:00";
            }else{
                return this.timeformat(outtime.getMinutes()) + ":" + this.timeformat(outtime.getSeconds());
            }




        }else {
            return (this.timeformat(hrs) + ":" + this.timeformat(mns));
        }
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

