//Permanent global variables
var scoreboardArray = [];
var scoreboardArrayPrimary = [];
var isGameEnded = false;
var previousBoost = [];
var totalBoostUsage = [0,0];
var winningTeam = 0;
var lastBoost = 0;
var boostCapture = [];

function connect() {
    var ws = new WebSocket('ws://localhost:49122');
    ws.onopen = () => {
        // subscribe to some channel
    };

    ws.onmessage = (e) => {

        var jEvent = JSON.parse(event.data);

        console.log(jEvent);



        if (jEvent.event == "game:update_state") {
            if ($('.Assister').text() == "") {
                $('.Assister').text("Unassisted");
            }

            $('#ScoreboardOrangeTeamName').text(document.getElementById('OrangeTeamName').textContent);
            $('#ScoreboardBlueTeamName').text(document.getElementById('BlueTeamName').textContent);
            //Catch if replay will end doesn't proc
            var i = 0;
            var j = 3;
            for (player in jEvent.data.players)
            {
                if ((jEvent.data.game.hasTarget == true)&& (!jEvent.data.game.isReplay)) {
                    $('#FocusPlayer').css("opacity","1");
                    if (player == jEvent.data.game.target) {
                        console.log(jEvent.data.players[player].team);
                        var boost = jEvent.data.players[player].boost;
                        //$('.BottomBoost').css("clip-path", ("inset(" + (100 - jEvent.data.players[player].boost).toString() + "% 0px 0px 0px)"));
                        if (jEvent.data.players[player].team == 0) { // Blue Team
                            let boostPercentage = 100 - boost; // Calculate the width to fill from right to left
                            $('#BoostBarBlue').css('width', `${boost*3.8}px`)   // Show Blue Boost Bar and set width
                            $('#BoostBarOrange').hide();   // Hide Orange Boost Bar
                            $('#BoostBarBlue').show();
                            $('#BottomBoostBoostLeft').text(boost);
                        
                            // Show the focused player for Blue Team, hide for Orange Team
                            $('.FocusPlayerBlue').css("opacity", "1");
                            $('.FocusPlayerOrange').css("opacity", "0");
                        
                        } else { // Orange Team
                            let boostPercentage = 100 - boost; // Calculate the width to fill from right to left
                            $('#BoostBarOrange').css('width', `${boost*3.8}px`);  // Show Orange Boost Bar and set width
                            $('#BoostBarOrange').show();   // Hide Orange Boost Bar
                            $('#BoostBarBlue').hide();
                            $('#BottomBoostBoostRight').text(boost);
                        
                            // Show the focused player for Orange Team, hide for Blue Team
                            $('.FocusPlayerOrange').css("opacity", "1");
                            $('.FocusPlayerBlue').css("opacity", "0");
                        
                        }
                        $('.FocusPlayerName').text(jEvent.data.players[player].name);
                        $('.FocusPlayerGoals').text(jEvent.data.players[player].goals);
                        $('.FocusPlayerAssists').text(jEvent.data.players[player].assists);
                        $('.BottomBoostBoost').text(jEvent.data.players[player].boost);
                        var boost = jEvent.data.players[player].boost;
                        $('.progress').css('--i', boost);
                        if (boost < 50) {
                            $('.progress').addClass('less');
                        } else {
                            $('.progress').removeClass('less');
                        }
                        $('.FocusPlayerSaves').text(jEvent.data.players[player].saves);
                        $('.FocusPlayerShots').text(jEvent.data.players[player].shots);
                        $('.FocusPlayerScore').text(jEvent.data.players[player].score);
                    } else{
                    }
                } else {
                    $('#FocusPlayer').css("opacity","0");
                }
                if (jEvent.data.game.isReplay) {
                    $('#FocusPlayer').css("opacity","0");
                }
                if (jEvent.data.players[player].team == 0)
                {
                    i++;
                    var strokeBoost = -270 + (jEvent.data.players[player].boost*(270/100));
                    $('#BlueBoostImage' + i).css("left", (strokeBoost.toString() + "px"));
                    $('#BoostBarName' + i).text(jEvent.data.players[player].name);
                    var tempBoost = jEvent.data.players[player].boost;
                    $('#BoostBarBoost' + i).text(tempBoost);
                    $('#BoostCircleBoost' + i).text(tempBoost);
                    $('#FocusGoals' + i).text(jEvent.data.players[player].goals);
                    $('#FocusAssists' + i).text(jEvent.data.players[player].assists);
                    $('#FocusShots' + i).text(jEvent.data.players[player].shots);
                    $('#FocusSaves' + i).text(jEvent.data.players[player].saves);
                    $('#FocusSpeed' + i).text(jEvent.data.players[player].speed + " KM/H");
                    var variable = tempBoost.toString() + "%";
                    $('#Player' + i + 'BoostBar').attr("width", variable);
                    if (jEvent.data.players[player].isDead) {
                        $('#DemodPlayer' + i).removeClass('Invisible');
                    }
                    else
                    {
                        $('#DemodPlayer' + i).addClass('Invisible');
                    }
                    $('#PlayerBoostBarDiv' + i).removeClass('Invisible');
                }
                else if (jEvent.data.players[player].team == 1)
                {
                    j++;
                    if (player == jEvent.data.game.target) {
                        $('#PlayerFocus' + j).css("opacity", "1")
                    }
                    else{
                        $('#PlayerFocus' + j).css("opacity", "0")
                    }
                    var strokeBoost = 270 - (jEvent.data.players[player].boost*(270/100));
                    $('#OrangeBoostImage' + j).css("left", (strokeBoost.toString() + "px"));
                    $('#BoostBarName' + j).text(jEvent.data.players[player].name);
                    var tempBoost = jEvent.data.players[player].boost;
                    $('#BoostBarBoost' + j).text(tempBoost);
                    $('#BoostCircleBoost' + j).text(tempBoost);
                    $('#FocusGoals' + j).text(jEvent.data.players[player].goals);
                    $('#FocusAssists' + j).text(jEvent.data.players[player].assists);
                    $('#FocusShots' + j).text(jEvent.data.players[player].shots);
                    $('#FocusSaves' + j).text(jEvent.data.players[player].saves);
                    $('#FocusSpeed' + j).text(jEvent.data.players[player].speed + " KM/H");
                    var variable = tempBoost.toString() + "%";
                    $('#Player' + j + 'BoostBar').attr("width", variable);
                    if (jEvent.data.players[player].isDead) {
                        $('#DemodPlayer' + j).removeClass('Invisible');
                    }
                    else
                    {
                        $('#DemodPlayer' + j).addClass('Invisible');
                    }
                    $('#PlayerBoostBarDiv' + j).removeClass('Invisible');
                }
            }
            while (i<3){
                i++;
                $('#PlayerBoostBarDiv' + i).addClass('Invisible');

            }
            while (j<6){
                j++
                $('#PlayerBoostBarDiv' + j).addClass('Invisible');
            }

            // Set team names
            // $('.BlueTeamName').text(jEvent.data.game.teams[0].name);
            // $('.OrangeTeamName').text(jEvent.data.game.teams[1].name);

            // Set team scores
            $('#BlueScore').text(jEvent.data.game.teams[0].score)
            $('#OrangeScore').text(jEvent.data.game.teams[1].score)

            //Time stuff
            var currentTime = jEvent.data.game.time_seconds;
            var resultingTime = "";
            if (currentTime>60) {
                var seconds = currentTime%60;
                if (seconds.toString().length < 2) {
                    seconds = "0" + seconds.toString();
                }
                var minutes = (currentTime-seconds)/60;
                resultingTime = minutes + ":" + seconds;
            } else {
                resultingTime = currentTime;
            }
            if (jEvent.data.game.isOT) {
                resultingTime = "+" + resultingTime;
                $('#OT').removeClass('Invisible')
            } else {
                $('#OT').addClass('Invisible')
            }
            $('.Time').text(resultingTime);

            //Current Player Stuff
            var currentPlayer = jEvent.data.game.target;
            if (currentPlayer == "") {
                $('#OrangePlayerCurrent').addClass("Invisible");
                $('#BluePlayerCurrent').addClass("Invisible");
                $('.BluePlayerCurrent').addClass("Invisible");
                $('.OrangePlayerCurrent').addClass("Invisible");
            } else if (jEvent.data.players[currentPlayer].team == 0) {
                $('#OrangePlayerCurrent').addClass("Invisible");
                $('#BluePlayerCurrent').removeClass("Invisible");
                $('.OrangePlayerCurrent').addClass("Invisible");
                $('.BluePlayerCurrent').removeClass("Invisible");
            } else if (jEvent.data.players[currentPlayer].team == 1) {
                $('#OrangePlayerCurrent').removeClass("Invisible");
                $('#BluePlayerCurrent').addClass("Invisible");
                $('.OrangePlayerCurrent').removeClass("Invisible");
                $('.BluePlayerCurrent').addClass("Invisible");
            }



            if (currentPlayer != "") {
                $('.PlayerName').text(jEvent.data.players[currentPlayer].name.toUpperCase());
                $('.PlayerGoals').text(jEvent.data.players[currentPlayer].goals);
                $('.PlayerAssists').text(jEvent.data.players[currentPlayer].assists);
                $('.PlayerShots').text(jEvent.data.players[currentPlayer].shots);
                $('.PlayerSaves').text(jEvent.data.players[currentPlayer].saves);
                $('.PlayerTouches').text(jEvent.data.players[currentPlayer].touches);
                $('.PlayerDemos').text(jEvent.data.players[currentPlayer].demos);
                $('.FocusBoostNumber').text(jEvent.data.players[currentPlayer].boost);
                $('.FocusSpeed').text(jEvent.data.players[currentPlayer].speed + " km/h");
                //Boost meter, Fuck me that was more complicated than it should have been
                var tempBoost = jEvent.data.players[currentPlayer].boost;
                $('.BoostShadow').css("opacity", (tempBoost/100));
                var variable = "";
                if (tempBoost > 95) {
                    var temp = ((tempBoost - 100) * 10) + 50;
                    // 100% clip-path: polygon(100% 50%, 50% 50%, 100% 100%, 0 100%, 0 0, 100% 0);
                    //95% clip-path:   polygon(100%   0, 50% 50%, 100% 100%, 0 100%, 0 0, 100% 0);
                    variable = "polygon(100% " + temp.toString() + "%, 50% 50%, 100% 100%, 0% 100%, 0% 0%, 100% 0%)"
                } else if (tempBoost>50 && tempBoost<=95) {
                    //95% clip-path:  polygon(100% 0, 50% 50%, 100% 100%, 0 100%, 0 0, 100% 0);
                    // 50% clip-path: polygon(0    0, 50% 50%, 100% 100%, 0 100%, 0 0,    0 0);
                    var temp = (tempBoost-50)*(100/45);
                    variable = "polygon(" + temp.toString() + "% 0%, 50% 50%, 100% 100%, 0% 100%, 0% 0%, " + temp.toString() + "% 0%)";
                } else if (tempBoost>5 && tempBoost<=50) {
                    //50% clip-path: polygon(0    0, 50% 50%, 100% 100%, 0 100%, 0    0, 0    0);
                    // 5% clip-path: polygon(0 100%, 50% 50%, 100% 100%, 0 100%, 0 100%, 0 100%);
                    var temp = ((tempBoost-50)*-1)*(100/45);
                    variable = "polygon(0% " + temp.toString() + "%, 50% 50%, 100% 100%, 0% 100%, 0% " + temp.toString() + "%, 0% " + temp.toString() + "%)";
                } else {
                    //5% clip-path: polygon(0   100%, 50% 50%, 100% 100%, 0   100%, 0   100%, 0   100%);
                    //0% clip-path: polygon(50% 100%, 50% 50%, 100% 100%, 50% 100%, 50% 100%, 50% 100%);
                    var temp = ((tempBoost-5)*-1) * 10;
                    variable = "polygon(" + temp.toString() + "% 100%, 50% 50%, 100% 100%, " + temp.toString() + "% 100%, " + temp.toString() + "% 100%, " + temp.toString() + "% 100%)";
                }
                if (tempBoost>lastBoost) {

                    $('.BehindTD').css("transition", "clip-path 0s");
                    $('.BehindTD').css("clip-path", variable);
                    console.log("lastBoost: " + lastBoost + ". tempBoost: " + tempBoost + ". transition: " + $('.BehindTD').css("transition"));
                    $('.BehindTD').css("transition", "clip-path 0.35s");
                }
                else{
                    $('.BehindTD').css("clip-path", variable);
                }
                lastBoost = tempBoost;
                console.log("lastBoost: " + lastBoost + ". tempBoost: " + tempBoost + ". transition: " + $('.BehindTD').css("transition"));
            }
            //Postgame scoreboard stuff
            if (!isGameEnded) {
                var playersForScorboard = jEvent.data.players;
                for (var player in playersForScorboard) {
                    var indexForPrimary = scoreboardArrayPrimary.indexOf(player);
                    var temp = [];
                    temp.push(player);
                    temp.push(jEvent.data.players[player].name);
                    temp.push(jEvent.data.players[player].goals);
                    temp.push(jEvent.data.players[player].assists);
                    temp.push(jEvent.data.players[player].saves);
                    temp.push(jEvent.data.players[player].shots);
                    temp.push(jEvent.data.players[player].touches);
                    temp.push(jEvent.data.players[player].demos);
                    temp.push(jEvent.data.players[player].team);
                    temp.push(jEvent.data.players[player].boost);
                    if (indexForPrimary == -1) {
                        scoreboardArrayPrimary.push(player);
                        scoreboardArray.push(temp);
                        previousBoost.push(33);
                        boostCapture.push(0);
                    } else {
                        if (jEvent.data.players[player].boost < previousBoost[indexForPrimary] && !jEvent.data.game.isReplay) {
                            var boostDifference = previousBoost[indexForPrimary] - jEvent.data.players[player].boost;
                            boostCapture[indexForPrimary] = boostCapture[indexForPrimary] + previousBoost[indexForPrimary];
                            if (jEvent.data.players[player].team == 0) {
                                totalBoostUsage[0] += boostDifference;
                            } else {
                                totalBoostUsage[1] += boostDifference;
                            }
                        }
                        previousBoost[indexForPrimary] = jEvent.data.players[player].boost;
                        scoreboardArray[indexForPrimary] = temp;
                    }
                }
            }


        } else if (jEvent.event == "sos:version") {

        } else if (jEvent.event == "game:match_ended"){
            var tempBlue = $('#BlueTeamImage').attr("src");
            var tempOrange = $('#OrangeTeamImage').attr("src");
            $('#PGOrangeTeamLogo').attr('src',tempOrange);
            $('#PGBlueTeamLogo').attr('src',tempBlue);
            winningTeam = jEvent.data.winner_team_num;
            if (winningTeam==0) {
                var seriesScoreTemp = parseInt($('#BlueSeriesStorage').text()) + 1
                $('#PGBlueSeriesScore').text(seriesScoreTemp);
                $('#PGOrangeSeriesScore').text($('#OrangeSeriesStorage').text());
            }
            else {
                var seriesScoreTemp = parseInt($('#OrangeSeriesStorage').text()) + 1;
                $('#PGOrangeSeriesScore').text(seriesScoreTemp);
                $('#PGBlueSeriesScore').text($('#BlueSeriesStorage').text());
                $('#PGBlueWL').text("DEFEAT");
                $('#PGOrangeWL').text("VICTORY");
            }
            $('#InGameOverlay').addClass("Invisible");
            $('#Replay').addClass("Invisible");
        } else if (jEvent.event == "game:podium_start") {
            $('#InGameOverlay').addClass("Invisible");
            $('#Replay').addClass("Invisible");
            var i = 3;
            var j = 0;
            var blueTouches = 0;
            var orangeTouches = 0;
            var blueSeriesScore = 0;
            var orangeSeriesScore = 0;
            var PGStats = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
            var PGTouches = [0,0];
            for (var player in scoreboardArray) {

                if (i < 6 && scoreboardArray[player][8] == 1) {
                    i++;
                    var currentPlayerId = "#Player" + i;
                    $(currentPlayerId + "Name").text(scoreboardArray[player][1]);
                    $(currentPlayerId + "Goals").text(scoreboardArray[player][2]);
                    $(currentPlayerId + "Assists").text(scoreboardArray[player][3]);
                    $(currentPlayerId + "Shots").text(scoreboardArray[player][5]);
                    $(currentPlayerId + "Saves").text(scoreboardArray[player][4]);
                    $(currentPlayerId + "Touches").text(scoreboardArray[player][6]);
                    $(currentPlayerId + "Demos").text(scoreboardArray[player][7]);
                    $(currentPlayerId + "BC").text(boostCapture[player]);
                    orangeTouches += scoreboardArray[player][6]; //new
                    PGStats[0][0] = PGStats[0][0] + scoreboardArray[player][2];
                    PGStats[0][1] = PGStats[0][1] + scoreboardArray[player][3];
                    PGStats[0][2] = PGStats[0][2] + scoreboardArray[player][5];
                    PGStats[0][3] = PGStats[0][3] + scoreboardArray[player][4];
                    PGStats[0][4] = PGStats[0][4] + scoreboardArray[player][6];
                    PGStats[0][5] = PGStats[0][5] + scoreboardArray[player][7];
                    PGStats[0][6] = PGStats[0][6] + boostCapture[player];
                    PGTouches[0] = PGTouches[0] + scoreboardArray[player][6];
                    // = PGStats[0]+[scoreboardArray[player][2],scoreboardArray[player][3],scoreboardArray[player][5],scoreboardArray[player][4],scoreboardArray[player][6],scoreboardArray[player][7],boostCapture[player]]
                } else if (j < 3 && scoreboardArray[player][8] == 0) {
                    j++;
                    var currentPlayerId = "#Player" + j;
                    $(currentPlayerId + "Name").text(scoreboardArray[player][1]);
                    $(currentPlayerId + "Goals").text(scoreboardArray[player][2]);
                    $(currentPlayerId + "Assists").text(scoreboardArray[player][3]);
                    $(currentPlayerId + "Shots").text(scoreboardArray[player][5]);
                    $(currentPlayerId + "Saves").text(scoreboardArray[player][4]);
                    $(currentPlayerId + "Touches").text(scoreboardArray[player][6]);
                    $(currentPlayerId + "Demos").text(scoreboardArray[player][7]);
                    $(currentPlayerId + "BC").text(boostCapture[player]);
                    blueTouches += scoreboardArray[player][6]; //new
                    PGStats[1][0] = PGStats[1][0] + scoreboardArray[player][2];
                    PGStats[1][1] = PGStats[1][1] + scoreboardArray[player][3];
                    PGStats[1][2] = PGStats[1][2] + scoreboardArray[player][5];
                    PGStats[1][3] = PGStats[1][3] + scoreboardArray[player][4];
                    PGStats[1][4] = PGStats[1][4] + scoreboardArray[player][6];
                    PGStats[1][5] = PGStats[1][5] + scoreboardArray[player][7];
                    PGStats[1][6] = PGStats[1][6] + boostCapture[player];
                    PGTouches[1] = PGTouches[1] + scoreboardArray[player][6];
                    //PGStats[1] = PGStats[1]+[scoreboardArray[player][2],scoreboardArray[player][3],scoreboardArray[player][5],scoreboardArray[player][4],scoreboardArray[player][6],scoreboardArray[player][7],boostCapture[player]]
                }
                //new
                var OrangeBoostUsed = Math.ceil((totalBoostUsage[1]/(totalBoostUsage[0] + totalBoostUsage[1]))*100);
                var BlueBoostUsed = Math.floor((totalBoostUsage[0]/(totalBoostUsage[0] + totalBoostUsage[1]))*100);
                var OrangeBallPossessionPercent = Math.ceil((orangeTouches/(blueTouches+orangeTouches))*100);
                var BlueBallPossessionPercent = Math.floor((blueTouches/(blueTouches+orangeTouches))*100);

                $('#OrangeBoostUsage').text(OrangeBoostUsed + "%");
                $('#BlueBoostUsage').text(BlueBoostUsed + "%");
                $('#BlueBoostBar').height(BlueBoostUsed + "%");
                $('#BoostInbetweenBar').attr('y', (OrangeBoostUsed) + "%");


                $('#PGBC2').attr('offset', OrangeBoostUsed + "%");
                $('#PGBC4').attr('offset', OrangeBoostUsed + "%");

                $('#PGBP2').attr('offset', OrangeBallPossessionPercent + "%");
                $('#PGBP4').attr('offset', OrangeBallPossessionPercent + "%");
                if (OrangeBallPossessionPercent>50) {
                    var temp2 = OrangeBallPossessionPercent - 5;
                    $('#PGFD2').attr('offset', temp2 + "%");
                    $('#PGFD4').attr('offset', temp2 + "%");
                } else {
                    var temp2 = OrangeBallPossessionPercent + 5;
                    $('#PGFD2').attr('offset', temp2 + "%");
                    $('#PGFD4').attr('offset', temp2 + "%");
                }


                $('#BluePossessionBar').height(BlueBallPossessionPercent + "%");
                $('#PossessionInbetweenBar').attr('y', (OrangeBallPossessionPercent) + "%");
                $('#BlueBallPossession').text(BlueBallPossessionPercent + "%");
                $('#OrangeBallPossession').text(OrangeBallPossessionPercent + "%");
            }
            $('#FinalGoals').text(PGStats[1][0].toString() + ":" + PGStats[0][0].toString());
            $('#FinalAssists').text(PGStats[1][1].toString() + ":" + PGStats[0][1].toString());
            $('#FinalSaves').text(PGStats[1][3].toString() + ":" + PGStats[0][3].toString());
            $('#FinalShots').text(PGStats[1][2].toString() + ":" + PGStats[0][2].toString());
            $('#FinalDemos').text(PGStats[1][5].toString() + ":" + PGStats[0][5].toString());
            $('.TopInfo').text("Best Of 6 | " + document.getElementById('GameNumber').textContent);
            var PGEStats = [];
            for (var x = 0; x<PGStats[0].length; x++){
                console.log(PGStats[1][x], " and ", PGStats[0][x])
                if ((PGStats[0][x] == 0) && (PGStats[1][x]==0)) {
                    PGEStats[x] = 0;
                } else {
                    var tempVarA = (PGStats[0][x]+PGStats[1][x]);
                    console.log(tempVarA);
                    if (tempVarA == 0) {
                        console.log("Fail");
                        var tempVarB = 0;
                    } else {
                        if (PGStats[0][x] != 0) {
                            var tempVarB = PGStats[0][x]/ tempVarA;
                            tempVarB = 1 -tempVarB;
                        } else {
                            var tempVarB = PGStats[1][x]/tempVarA;
                            console.log(tempVarB);
                        }
                    }
                    console.log(tempVarB);
                    var tempVar = Math.floor(tempVarB*100);
                    PGEStats[x] = tempVar;
                }
            }

            console.log(PGEStats);
            if (PGEStats[0] != 0) {
                $('#PGGS2').attr('offset',PGEStats[0] + "%");
                $('#PGGS4').attr('offset',PGEStats[0] + "%");
            }
            if (PGEStats[1] != 0) {
                $('#PGAS2').attr('offset',PGEStats[1] + "%");
                $('#PGAS4').attr('offset',PGEStats[1] + "%");
            }
            if (PGEStats[2] != 0) {
                $('#PGSS2').attr('offset',PGEStats[2] + "%");
                $('#PGSS4').attr('offset',PGEStats[2] + "%");
            }
            if (PGEStats[3] != 0) {
                $('#PGShS2').attr('offset',PGEStats[3] + "%");
                $('#PGShS4').attr('offset',PGEStats[3] + "%");
            }
            if (PGEStats[4] != 0) {
                $('#PGTS2').attr('offset',PGEStats[4] + "%");
                $('#PGTS4').attr('offset',PGEStats[4] + "%");
            }
            if (PGEStats[5] != 0) {
                $('#PGDS2').attr('offset',PGEStats[5] + "%");
                $('#PGDS4').attr('offset',PGEStats[5] + "%");
            }
            if (PGEStats[6] != 0) {
                $('#PGBCS2').attr('offset',PGEStats[6] + "%");
                $('#PGBCS4').attr('offset',PGEStats[6] + "%");
            }
            //Blue Series Score for Scoreboard
            blueSeriesScore = parseInt(document.getElementById('BlueSeriesStorage').textContent);
            orangeSeriesScore = parseInt(document.getElementById('OrangeSeriesStorage').textContent);
            isGameEnded = true;
            endOfMatch();
        } else if (jEvent.event == "game:goal_scored") {
            $('#RBlueTeamImage').attr('src',$('#BlueTeamImage').attr('src'))
            $('#ROrangeTeamImage').attr('src',$('#OrangeTeamImage').attr('src'))
            playReplay();
            $('.Scorer').text(jEvent.data.scorer.name);
            $('.Assister').text(jEvent.data.assister.name);
            //BLUE
            if (jEvent.data.scorer.teamnum == 0) {
                if (jEvent.data.assister.name == "") {
                    $('.Scorer').css('color', '#FFFFFF')
                    $('.GoalSpeed').text(Math.round(jEvent.data.goalspeed)+" KM/H");
                    document.getElementById('OrangeReplayAssisted').style.display = 'none';
                    document.getElementById('BlueReplayAssisted').style.display = '';
                    //document.getElementById('SoloText').style.display = '';
                    document.getElementById('AssistedText').style.display = 'none';
                }
                else {
                    $('.Scorer').css('color', '#FFFFFF')
                    $('.GoalTime').text("TIME: " + document.getElementById("ClockTime").textContent);
                    $('.GoalSpeed').text(Math.round(jEvent.data.goalspeed)+" KM/H");
                    document.getElementById('OrangeReplayAssisted').style.display = 'none';
                    document.getElementById('BlueReplayAssisted').style.display = '';
                    //document.getElementById('SoloText').style.display = 'none';
                    document.getElementById('AssistedText').style.display = '';
                }
            }
            else {
                if (jEvent.data.assister.name == "") {
                    $('.Scorer').css('color', '#372f32')
                    $('.GoalTime').text("TIME: " + document.getElementById("ClockTime").textContent);
                    $('.GoalSpeed').text(Math.round(jEvent.data.goalspeed)+" KM/H");
                    document.getElementById('OrangeReplayAssisted').style.display = '';
                    document.getElementById('BlueReplayAssisted').style.display = 'none';
                    //document.getElementById('SoloText').style.display = '';
                    document.getElementById('AssistedText').style.display = 'none';
                }
                else{
                    $('.Scorer').css('color', '#372f32')
                    $('.GoalTime').text("TIME: " + document.getElementById("ClockTime").textContent);
                    $('.GoalSpeed').text(Math.round(jEvent.data.goalspeed)+" KM/H");
                    document.getElementById('OrangeReplayAssisted').style.display = '';
                    document.getElementById('BlueReplayAssisted').style.display = 'none';
                    //document.getElementById('SoloText').style.display = 'none';
                    document.getElementById('AssistedText').style.display = '';
                }
            }
            console.log($('.Assister').text());
        } else if (jEvent.event == "game:replay_end") {
            $('#Replay').addClass('Invisible');
        } else if (jEvent.event == "game:replay_start") {
            $('#Replay').removeClass('Invisible');
            var blueSrc = $('#BlueTeamImage').attr('src');
            var orangeSrc = $('#OrangeTeamImage').attr('src');
            document.getElementById('ScoreBoardBlueImage').src = blueSrc;
            document.getElementById('ScoreBoardOrangeImage').src = orangeSrc;
            $('#InGameOverlay').addClass("Invisible");
        } else if (jEvent.event == "game:replay_will_end") {
            leaveReplay();
        } else if (jEvent.event == "game:round_started_go") {
        } else if (jEvent.event == "game:post_countdown_begin") {
            $('#InGameOverlay').removeClass("Invisible");
        } else if (jEvent.event == "game:match_ended") {
            $('#ScoreboardOrangeTeamName').text(document.getElementById('OrangeTeamName').textContent)
            $('#ScoreboardBlueTeamName').text(document.getElementById('BlueTeamName').textContent)
            isGameEnded=true;
            $('#Replay').addClass("Invisible");
            $('#Scoreboard').addClass("Invisible");

        } else if (jEvent.event == "game:match_created" || jEvent.event == "game:initialized") {
            isGameEnded = false;
            scoreboardArray = [];
            scoreboardArrayPrimary = [];

            $('#InGameOverlay').removeClass("Invisible");
            $('#Replay').addClass("Invisible");
            $('#Scoreboard').addClass("Invisible");
            previousBoost = [];
            totalBoostUsage = [0,0];
            boostCapture = [];
        }
    }

    ws.onclose = function(e) {
        setTimeout(function() {
            connect();
        }, 5000);
    };

    ws.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
    };
}

connect();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playReplay() {
    document.getElementById('TransitionVideo').style.visibility = "";
    await sleep(2000);
    document.getElementById('TransitionVideo').play();
    await sleep(1000);
}

async function leaveReplay() {
    document.getElementById('TransitionVideo').style.visibility = "";
    await sleep(2000);
    document.getElementById('TransitionVideo').play();
    await sleep(1000);
}

async function endOfMatch() {
    $('#InGameOverlay').addClass('Invisible');
    $('#Replay').addClass('Invisible');
    document.getElementById('TransitionVideo').style.visibility = "";
    await sleep(4000);
    document.getElementById('TransitionVideo').play();
    await sleep(1000);
    $('#Scoreboard').removeClass('Invisible');
}