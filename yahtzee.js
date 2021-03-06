var diceNumbers =[0,0,0,0,0];
var diceChecked =[false,false,false,false,false];
var diceButtons=[0,0,0,0,0];
var diceImagesChecked=[0,0,0,0,0,0];
var diceImagesUnchecked=[0,0,0,0,0,0];
var assignButtonsEnabled = false;
var rollsLeft=3;
var assignCount = 13;

function initGame(){
    var imgTags = $('img');
    for (var i=0; i<imgTags.length; i++){
		var img = imgTags[i];
        img.draggable = false;
    }

    function setAssignButtonsEnabled(enabled){
        assignButtonsEnabled = enabled;
    }
    
    function newGame(){
        assignCount = 13;
        resetAssignButtonEvents();
        resetRollBtn();
        resetPoints();
        playSound(soundNewgame);
    }
    
    function resetPoints(){
        pointFieldsValues = {
            ones : 0,
            twos : 0,
            threes : 0,
            fours: 0,
            fives: 0,
            sixes: 0,
            threekind : 0,
            fourkind: 0,
            fullhouse: 0,
            smallstr: 0,
            largestr: 0,
            yahtzee: 0,
            chance: 0,
        };
        updateSumPoints();
        for (var key in pointsFields){
            pointsFields[key].innerText = '';
            pointsFields[key].setAttribute('class', 'points-field');
        }
    }
    
    $("#menu-button-newgame")[0].onclick = newGame;
    /*
    diceButtons[0] = $("#dice1 img")[0];
    diceButtons[1] = $("#dice2 img")[0];
    diceButtons[2] = $("#dice3 img")[0];
    diceButtons[3] = $("#dice4 img")[0];
    diceButtons[4] = $("#dice5 img")[0];
    */
    
    diceButtons[0] = $("#dice1")[0];
    diceButtons[1] = $("#dice2")[0];
    diceButtons[2] = $("#dice3")[0];
    diceButtons[3] = $("#dice4")[0];
    diceButtons[4] = $("#dice5")[0];
    
    assignButtons = {
        ones : $("#assign-button-ones")[0],
        twos : $("#assign-button-twos")[0],
        threes : $("#assign-button-threes")[0],
        fours: $("#assign-button-fours")[0],
        fives: $("#assign-button-fives")[0],
        sixes: $("#assign-button-sixes")[0],
        threekind : $("#assign-button-threekind")[0],
        fourkind: $("#assign-button-fourkind")[0],
        fullhouse: $("#assign-button-fullhouse")[0],
        smallstr: $("#assign-button-smallstr")[0],
        largestr: $("#assign-button-largestr")[0],
        yahtzee: $("#assign-button-yahtzee")[0],
        chance: $("#assign-button-chance")[0],
    };
    
    pointsFields = {
        ones : $("#points-field-ones")[0],
        twos : $("#points-field-twos")[0],
        threes : $("#points-field-threes")[0],
        fours: $("#points-field-fours")[0],
        fives: $("#points-field-fives")[0],
        sixes: $("#points-field-sixes")[0],
        threekind : $("#points-field-threekind")[0],
        fourkind: $("#points-field-fourkind")[0],
        fullhouse: $("#points-field-fullhouse")[0],
        smallstr: $("#points-field-smallstr")[0],
        largestr: $("#points-field-largestr")[0],
        yahtzee: $("#points-field-yahtzee")[0],
        chance: $("#points-field-chance")[0],
    };
    
    pointFieldsValues = {
        ones : 0,
        twos : 0,
        threes : 0,
        fours: 0,
        fives: 0,
        sixes: 0,
        threekind : 0,
        fourkind: 0,
        fullhouse: 0,
        smallstr: 0,
        largestr: 0,
        yahtzee: 0,
        chance: 0,
    }
    
    assignButtonFunctions = {
        ones : calcOnes,
        twos : calcTwos,
        threes : calcThrees,
        fours: calcFours,
        fives: calcFives,
        sixes: calcSixes,
        threekind : calcThreekind,
        fourkind: calcFourkind,
        fullhouse: calcFullhouse,
        smallstr: calcSmallstr,
        largestr: calcLargestr,
        yahtzee: calcYahtzee,
        chance: calcChance,
    };
    
    resetAssignButtonEvents();
    
    function resetAssignButtonEvents(){
        for (var key in assignButtons){
            pointsFields[key].onclick = assignPoints;
            assignButtons[key].onclick = assignPoints;
            assignButtons[key].setAttribute('class', 'assign-button');
        }
    }
    
    function updateSumPoints(){
        var topPoints = 0;
        topPoints += pointFieldsValues.ones;
        topPoints += pointFieldsValues.twos;
        topPoints += pointFieldsValues.threes;
        topPoints += pointFieldsValues.fours;
        topPoints += pointFieldsValues.fives;
        topPoints += pointFieldsValues.sixes;
        var bonusPoints = (topPoints>=63)?35:0;
        var topPointsTotal = topPoints + bonusPoints;
    
        var bottomPoints = 0;
        bottomPoints += pointFieldsValues.threekind;
        bottomPoints += pointFieldsValues.fourkind;
        bottomPoints += pointFieldsValues.fullhouse;
        bottomPoints += pointFieldsValues.smallstr;
        bottomPoints += pointFieldsValues.largestr;
        bottomPoints += pointFieldsValues.yahtzee;
        bottomPoints += pointFieldsValues.chance;
    
        var totalPoints = topPointsTotal + bottomPoints;
    
        $('#sum-points-top')[0].innerText = topPoints;
        $('#sum-points-bonus')[0].innerText = bonusPoints;
        $('#sum-points-top-total')[0].innerText = topPointsTotal;
        $('#sum-points-bottom')[0].innerText = bottomPoints;
        $('#sum-points-total')[0].innerText = totalPoints;
        return totalPoints;
    }
    
    function assignPoints(event){
        if (assignButtonsEnabled){
            var key = event.target.id.split("-")[2];
            var pntField = pointsFields[key];
            if (pntField) {
                var value = assignButtonFunctions[key]();
                pointFieldsValues[key] = value;
                pntField.innerText = value;
                pntField.onclick = null;
            }
            var assignBtn = assignButtons[key];
            if (assignBtn) {
                assignBtn.onclick = null;
            }
            $('#assign-button-'+key).toggleClass('assign-button-used');
            $('#points-field-'+key).toggleClass('points-field-used');
            assignCount--;
            resetRollBtn();
            var points = updateSumPoints();
            playSound(soundAssign);
            if (assignCount===0){
                alert('Congratulations! Your score is '+ points + 
                      '\nPost it in the comment section! ' +
                      '\nDon\'t forget to give a like! :)' );
            }
        }
    }
    
    function calcEyeNumberPoints(num){
        var result = 0;
        //for (var x of diceNumbers){
        for (var i=0; i<diceNumbers.length; i++){
            var x = diceNumbers[i];
            if (x === num) {
                result += num;
            }
        }
        return result;
    }
    
    function calcOnes(){
        return calcEyeNumberPoints(1);
    }

    function calcTwos(){
        return calcEyeNumberPoints(2);
    }
    
    function calcThrees(){
        return calcEyeNumberPoints(3);
    }
    
    function calcFours(){
        return calcEyeNumberPoints(4);
    }
    
    function calcFives(){
        return calcEyeNumberPoints(5);
    }
    
    function calcSixes(){
        return calcEyeNumberPoints(6);
    }
    
    function equalNumbers(arr){
        //for (var x of arr){
        for (var i=0; i < arr.length; i++){
            var x = arr[i];
            if(x !== arr[0]){
                return false;
            }
        }
        return true;
    }
    
    function getSum(total, num) {
        return total + num;
    }
    
    function calcThreekind(){
        diceNumbers.sort();
        var threekind = equalNumbers(diceNumbers.slice(0,3))
        || equalNumbers(diceNumbers.slice(1,4))
        || equalNumbers(diceNumbers.slice(2,5));
        return threekind ? diceNumbers.reduce(getSum) : 0;
    }
    
    function calcFourkind(){
        diceNumbers.sort();
        var fourkind = equalNumbers(diceNumbers.slice(0,4))
        || equalNumbers(diceNumbers.slice(1,5));
        return fourkind ? diceNumbers.reduce(getSum) : 0;
    }
    
    function calcFullhouse(){
        diceNumbers.sort();
        var fullhouse = (equalNumbers(diceNumbers.slice(0,3)) && equalNumbers(diceNumbers.slice(3,5)))
        || (equalNumbers(diceNumbers.slice(0,2)) && equalNumbers(diceNumbers.slice(2,5)));
        return fullhouse ? 25 : 0;
    }
    
    function calcYahtzee(){
        var yahtzee = equalNumbers(diceNumbers.slice(0,5));
        return yahtzee ? 50 : 0;
    }
    
    function calcChance(){
        return diceNumbers.reduce(getSum);
    }
    
    function equalArrays(a, b){
        for(var i=0; i<6; i++){
            if (a[i] !== b[i]){
                return false;
            }
        }
        return true;
    }
    
    function calcLargestr(){
        diceNumbers.sort();
        var largestr = equalArrays(diceNumbers, [1,2,3,4,5]) || equalArrays(diceNumbers, [2,3,4,5,6]);
        return largestr ? 40 : 0;
    }
    
    function calcSmallstr() { //Worst algorithm ever :D
        noDupl = diceNumbers.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })
        noDupl.sort();
    
        part1 = noDupl.slice(0,4);
        part2 = noDupl.slice(1,5);
    
        var smallStr = equalArrays(part1, [1,2,3,4])
        || equalArrays(part1, [2,3,4,5])
        || equalArrays(part1, [3,4,5,6])
        || equalArrays(part2, [1,2,3,4])
        || equalArrays(part2, [2,3,4,5])
        || equalArrays(part2, [3,4,5,6]);
        return smallStr ? 30 : 0;
    }
    
    var rollBtn = $("#roll-button")[0];
    
    var rollBtnCounter = $("#roll-button-counter")[0];
    
    diceImagesChecked[0] = 'http://i.imgur.com/eT66RXK.gif';
    diceImagesChecked[1] = 'http://i.imgur.com/IUpLAr0.gif';
    diceImagesChecked[2] = 'http://i.imgur.com/Mn8JIkm.gif';
    diceImagesChecked[3] = 'http://i.imgur.com/jlijoBF.gif';
    diceImagesChecked[4] = 'http://i.imgur.com/eWWMSL1.gif';
    diceImagesChecked[5] = 'http://i.imgur.com/Bjyslez.gif';
    diceImagesChecked[6] = 'http://i.imgur.com/iLfeAsV.gif';
    
    diceImagesUnchecked[0] = 'http://i.imgur.com/eT66RXK.gif';
    diceImagesUnchecked[1] = 'http://i.imgur.com/I6W71Jy.gif';
    diceImagesUnchecked[2] = 'http://i.imgur.com/RyfXSAl.gif';
    diceImagesUnchecked[3] = 'http://i.imgur.com/ovFLMD9.gif';
    diceImagesUnchecked[4] = 'http://i.imgur.com/gsPyTMo.gif';
    diceImagesUnchecked[5] = 'http://i.imgur.com/fZyIs2N.gif';
    diceImagesUnchecked[6] = 'http://i.imgur.com/NZOXUNF.gif';
    
    function resetDice(){
        diceNumbers=[0,0,0,0,0];
        diceChecked=[false,false,false,false,false];
        refreshAllDice();
    }
    
    function refreshAllDice(){
        diceButtons.forEach(refreshDice);
    }
    
    /*
    function refreshDice(diceBtn, index){
        var active = diceChecked[index];
        var srcArr = active?diceImagesChecked:diceImagesUnchecked;
        var num = diceNumbers[index];
        diceBtn.src = srcArr[num];
        diceBtn.enabled = num!==0;
    }
    */
    
    function refreshDice(diceBtn, index){
        var active = diceChecked[index];
        var dice = $('#'+diceBtn.id + ' .dice');
        if (active){
            dice.addClass('dice-locked');
        } else {
            dice.removeClass('dice-locked');
        }
        var num = diceNumbers[index];
        for (var i=0; i<=6; i++){
            dice.removeClass('dice-'+i);
        }
        dice.addClass('dice-'+num);
        diceBtn.enabled = num!==0;
    }
    
    function animateDice(diceBtn, index){
        var active = diceChecked[index];
        var dice = $('#'+diceBtn.id + ' .dice');
        if (active){
            dice.removeClass('dice-animated');
        } else {
            dice.addClass('dice-animated');
            setTimeout(function(){ 
                dice.removeClass('dice-animated')
                playSound(soundDice);
            }, 900 + getRandomInt(0, 100)); //offset dice sounds
        }
    }
    
    diceButtons.forEach(function(btn, index){
        btn.addEventListener("click", clickDice);
        refreshDice(btn, index)
    });
    
    rollBtn.onclick = rollAction;
    
    function clickDice(event){
        var index = diceButtons.indexOf(event.currentTarget);
        if (diceNumbers[index]!==0){
            diceChecked[index] = !diceChecked[index];
        } else {
            diceChecked[index] = false;
        }
        refreshAllDice();
    }
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function rollDice(){
        for (var i=0; i<6;i++){
            if (diceChecked[i] === false) {
                diceNumbers[i] = getRandomInt(1,6);
                animateDice(diceButtons[i], i);
            }
        }
        refreshAllDice();
    }
    
    function refreshRollBtnState(){
        rollBtnCounter.innerText = rollsLeft + "x";
        if (rollsLeft > 0 && assignCount > 0) {
            rollBtn.onclick = rollAction;
        } else {
            rollBtn.onclick = null;
        }
    }
    
    function resetRollBtn(){
        rollsLeft = 3;
        setAssignButtonsEnabled(false);
        refreshRollBtnState();
        resetDice();
    }
    
    function rollAction(){
        if (rollsLeft > 0){
            //playSound(soundDice);
            rollsLeft--;
            setAssignButtonsEnabled(true);
            refreshRollBtnState();
            rollDice();
        }
    }
    
    function playSound(source){
        var audio = new Audio(source);
        audio.play();
    }

}

var soundAssign = 'data:audio/mp3;base64,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';

var soundNewgame = 'data:audio/mp3;base64,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';

var soundDice = 'data:audio/mp3;base64,SUQzAwAAAAAfdlRJVDIAAAACAAAAL1RQRTEAAAABAAAAVEFMQgAAAAEAAABUWUVSAAAAAQAAAFRDT04AAAAIAAAAV2VpdGVyZVRSQ0sAAAABAAAAQ09NTQAAACYAAABlbmcAaHR0cDovL29ubGluZS1hdWRpby1jb252ZXJ0ZXIuY29tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kkQAAAAAAGkAAAAAAAANIAAAAAAAAaQAAAAAAAA0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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Go2Gw2GwGCCAhDQ+QXU4HDouceQPiZhhITBoMiQ885jRoLQFDWSsaaVDcaCLu5i3mOLc8al/3J0MJHEQSC4aCw3ttW7KeNCAkFg4eJanUnOLMhISMpIiiwYeYY27X7c8yhOhlDDGZzCdLt//2MZT+r/PJ2POaZdlef//////////////SoxWFDGNhqNhsNhsBgq6PaZCPxeZl4bH+7xwC4L/PvF5IHjfc+TjIkRQW/kLtG5YfJ//M0aZsev/ZXf5CY59Gf/7/b/2X/////+rz///////////////4IAARgmiiiluo8syLhJEwaFDUQC+//uSZAoAA8iQXbY1QAJKsgu2wQgATVz1Yrz1gCDxiO0XhDAEE3GHJpuRhQHBZHwiALBEBRiKC6EUUPMIhaGJMPTjXKqewtEotk48Wq5xymj8hJi2unKq2qnHkKGlbnzkr6GnEhh/uadOZZpzf11OZnMn96X9v+iLf/+av/////////////////+AAEYJooor+trJMwNh0VUZGSxVdyGs7qYxigzLSUejuSg9/Cj+LRH9ntpLfSvkq+tb+WU9G7f/////////9fv////////////////ACfLaNlNG6TWCxwDmJkLXiQR4lxysh0qNRtAHGg+VDvhZx5ROjrjpRL7OjuzY1S3au9TpCWNdEqOSqUarY+NkdREo/bJlKabTZkwOrNOoSw+y+/Yed+1yY0OjSoSceBmMgFINbiM6L3u+j4AT/1FNMqkR2pOoYzqREolCEhsKGhwNGCrnHBzAmdXSCSV6ooReeGSCCwNJljkzPrBUNRXaLXMJ/snsNOIwAAAACkZZkOCbi19t70bT9cbJTKAqKPlyYGiz/h2DVhoPBwHYaP/7kmQTgAN5Q1btYQAAPoRLDaGMABF+QW24c4AJX0gudwIgAUFBwRC5ooJzqyRYlnkUNZRwwe98Vb1aPDbPGekkVPEPdRFxXZa3U2RVONmti0m+vi259ZpeI4pV8oq0AJ8JpaHzHTW4SxTJyXEYAAAABSMsiepkmbjA8OgpmLMocyMY89xstVVamfSUrkef553cYseWXW6osbSLoUxHq9ehz4fS6Mua/65MwACiQUG21Havl+dB6PRDckYXHR8cJD4vFBcpHyDECpo2Gw6N7ueQQqX5J0nnjea04xyDMQU4wmNChg4XGTicqeiGINCEfaTIjc048qeqj5Y9UIZ8gr6HMxlM8fPGho3NEtAHkhIHdkd65+kx/DwWBIUEhhINJlhv5v++3/89Zjoyf//////////////wAUSCg22o7V8vzoPR6P+VH9H1YUpEXast3VktPbQ0h10Y7gjo5lvJIjV9WsQk57lOc6E/7z7VdyEkYjf/z2nadtnY7sd1f//uRv/7////////////////wETf+ywARgjgqiSFMcK0WRZ57Tb/+5JkCYADz5BbrgjgAkYSC7XAFABNqkFrOCKACSrILicCIAGGG6GtZ2Sz1ZGNPaysnXeh5AcbJMTW7TiB5cWqI4uVWIjw+KzTWHHKhURHJnCQJI+RKqGhUeWNIseepFyZhJTR1UVB4w6ccaNTe1HsYe44w6TQow63/807/+VX///////////////+ib/2WB//9XX+RFbTf+jGpZkX3sdTiDEdUZodzymJOJGFU6AwSMKHLRj7FVyP3VPW1fXXRV9f/+3//////////////////gf/////1CAglAigiAmOFBiyDFM6qOSpXZ7HFWRiDaMVuZmvcetlXe6MUSGiKKVUIjrLRHQWFzpQRFXYxau4bDzCRtyoOKxb0CJ5xZRCyIIKOmlmQjqzVbZnLqvN//3//z2///////////////+B//////UICCV/f/6etF/ev+tEf6y9joGfKI9CPMYzWKimIYs1NzWS9pC05VLQd0Y1ztSlfRnb712///1//1////////////////yxsmUUCkUCkUmwxmtQxCKNVEQ4oUeSjhIU//uSZAyAA7eQX24UoAJOcgwNwIQATkjlYhz3gAD4FSyDjmAAucXMBCYuNHioRM75DBwUYVFwEpZxAouNcYJoJF5GkHkacw8cYxc7sqzjjsr0VBIrnPOUjmnsjOyTFczHch3LN9pJ+jHY6ope6Ir///b/6uzzfu6f/////////////2NkyigUigUik2GM1qGf/7r9VkAyB/uUle0wHSx/Vn3nlBIBAGbgyQyQZfJBQxtyORyPy/66YzJ208///6af/ATIjOl///////////////MFT3eODXDT67RAiCFjCDFIkvCbYFsv0YUmBIPpsP15aGrT+S9XOPOqnl6uoEePqFGe1j1at2gyXa4E8GWSO103q3t9e9sZzL/mtquNY1ae1/eu7Wteus1386xGFRItoVBU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CuDCnABNZPtXvPWACQuVq7eGMAAmdNEJuqt1oIJF04YF8qF0mlmJplNzE1UpJTMbppoIMm7/TMlmSCZ1L+qqr///////////////1b5kHjDEODCwqHDXB+NAhHbKNxWosGg8rmEQIBII4kjxFxopNDjxaIwuIlnlFZ2V2MMIExIMJnqrISuYx72HidnImIRVnkDDC56o0dKLVDlu5jtQudz6ohjvucp12HTtNf21b/rQ5zTZ3/////////////////scAIAAITblHIEbDWpB9iNltYWeKXl7CaMBdKqiCIECoAgIxKLpIqluc58uavcvYxx24fd399TVbXvf93Lb7dft4dW89cS/mEzSEZTlLRa13Vxwk5y8wr2m62nDQFQifFuKkdkH35ag7bd/5Y4AQAAQm3KKKm8Cijuse0TeChI0/VSUvsUiVZe5nIZ/I2VVW6RFfYjP05EU0DC7XoGwRMmAkS9024quuJmJc86JGrClhgMAEBLctv4QIpSUJYSgWcN45WOLdyno8lfPpOHQaW/1//uSZBEAA1JH1n08wAI/INsPpIAAEX5BY7hygAlpyC03AiABI6fj46Ft8uRDnvwNlNX16yvv702d6fPFwkrbpo7MZe/HlaP5JOhta+3VeabH+0U7mXMyWYNetox95z4bhJbPz6hUgKUSt//JKWGAwAQEty2/hIB9wjOuS/tb0UOrTxAoJECaZo5B8i8RLdMgsDZYcOFTN8xoOvM959BYGnlSYcSFQbJZ8YRChAACIKFIZDImeqtns4g+RY04cHjSRQfCQWmkxoCxSkCSg4CjQCCzhcWDwqU6CgxxIRIUWFSCjI5hFmiIcD5xRdRQoMBhoFCYIGgYOiSHoQwuyIzyHWpFZkQZFJznOLFEVFSKKCRjkK7KU4HddEWzh5L7JdU2dijDnIi////+d/9FT//////////////IAARBQpDIZEz1Vs9nE//I/R0rBgXY6zL/qQ5rUf3Yrq3RhOCFsVCTN22RgSukpmKn+rkvOxSpajoVFV/3nY/uyLVnMDQyoVH////+reS9U//////////////4l0YxAAAAAC3aF0CRIKsF/P/7kmQIAANcRdd/PQACP+qq/+EIAE01H1fnpGuI+QEr/CGAAMmKk2dNqk0zhbDtZIMdwFRQWBEsVFhCKPNn2dRZxVBbFUhWOtaOYs6RWirW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';
