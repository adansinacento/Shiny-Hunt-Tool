var total_enconters = 0;
var probability = 0;
var ninetyAt = 0;
var current_combo = 0;
var num_kos = 0;
var custom_prob = 4096;

function IncreaseEncounter(){
    total_enconters += 1;
    UpdateData();
}

function catchCombo(charm, baseProbability){
    var factor = 1;
    var lure = $('#has_lure')[0].checked;

    //calculate base
    if (charm){
        factor += 2;
    }
    if (lure){
        factor += 1;
    }

    var combo = current_combo;

    //modify according to combo
    if (combo > 10){ //only calculate on 11+
        if (combo < 21){ //11-20
            factor += 3;
        } else if (combo < 31) { //21 - 30
            factor += 7;
        } else { //31+
            factor += 11;
        }
    }

    return factor / baseProbability;
}

function brilliantKo(charm, baseProbability){
    var factor = 1;

    //calculate base
    if (charm){
        factor += 2;
    }

    factor += num_kos; //num_kos actually stores the number of re-rolls
    console.log(factor);

    return factor / baseProbability;
}

function ChangeNumKos(kos){
    num_kos = parseInt(kos);
    UpdateData();
}

function masudaMethod(charm, prob, generation){
    var factor = 1;
    var masuda_factor = 0;
    if (generation == 4){
        masuda_factor = 4;
    } else if (generation > 4) {
        masuda_factor = 5;
    }

    factor += masuda_factor;

    if (charm){
        factor += 2;
    }

    return factor / prob;
}

function softReset(charm, prob){
    var factor = 1;
    if (charm){
        factor += 2;
    }

    return factor / prob;
}

function ChangeCustomProb(newProb){
    if (newProb < 1){
        $('#custom_prob').val(1);
        return;
    }

    custom_prob = newProb;
    UpdateData();
}

function BaseProbability(){
    //if user selected "custom" then we already know the probability
    if ($('#sel_meth').val() == 'custom'){
        return custom_prob;
    }

    var generation = $('#sel_gen').val();

    if (generation < 6)
        return 8192;
    else
        return 4096;
}

function getProbability(){
    var has_charm = $('#has_charm')[0].checked;
    var method = $('#sel_meth').val();
    var prob = BaseProbability();

    switch (method) {
        case 'cc':
            return catchCombo(has_charm, prob);
        case 'mm':
            var gen = $('#sel_gen').val();
            return masudaMethod(has_charm, prob, gen);
        case 'ko':
            return brilliantKo(has_charm, prob);
        default:
            return softReset(has_charm, prob);
    }
}

function DecreaseEncounters(){
    total_enconters -= 1;
    if (total_enconters <= 0)
    total_enconters = 0;
    UpdateData();
}

//sets a specific value to the encounters var, allowing the user to skip to specfic num
function CustomEncounters() {
    //get value from imput
    var enc = $('#custom_encounters').val();
    enc = Number(enc); //convert value to Num

    //verify its a valid number
    if (!Number.isInteger(enc)) {
        DisplayAlertSetup('alert-danger', 'Error!', 'Value can only be set to integer numbers.');
        return;
    }
    if (enc < 0) {//must be at least 0
        DisplayAlertSetup('alert-danger', 'Error!', 'Value cannot be lower than 0.');
        return;
    }

    //set to var and update
    total_enconters = enc;
    UpdateData();

    DisplayAlertSetup('alert-success', 'Success!', 'Number of encounters updated.');
}

function CustomCombo() {
    //get value from imput
    var combo = $('#custom_combo').val();
    combo = Number(combo); //convert value to Num

    //verify its a valid number
    if (!Number.isInteger(combo)) {
        DisplayAlertSetup('alert-danger', 'Error!', 'Value can only be set to integer numbers.');
        return;
    }
    if (combo < 0) {//must be at least 0
        DisplayAlertSetup('alert-danger', 'Error!', 'Value cannot be lower than 0.');
        return;
    }

    //set to var and update
    current_combo = combo;
    $('#combo').text(current_combo);
    UpdateData();

    DisplayAlertSetup('alert-success', 'Success!', 'Catch combo updated.');
}

function DisplayAlertSetup(ctxClass, title, message) {
    var html = '<div class="alert ' + ctxClass + ' alert-dismissible fade show"><button type="button" class="close" data-dismiss="alert" >&times;</button ><strong>' + title + '</strong>' + message + '</div >';

    $('#alert_setup').html(html);
}

function UpdateData() {
    //update enconters on screen
    $('#display_encounters').text(total_enconters);

    //calculate probability given current data
    var prob = getProbability();

    if (prob != probability) { //this stores the probability only when it changes from a previously saved value
        probability = prob;
        until90 = NinetyPercentAt(probability); //if probability changes, recalculate where the 90 percent will be at
    }

    //calculate binomial prob
    var binomial = BinomialProbability(prob, total_enconters) * 100; //multiply by 100 to obtain the percentage
    $('#binomial').text(binomial.toFixed(3) + '%'); //display on screen (fixed to 3 decimals)

    //calculate and display how many are we behind to get to the 90% binomial
    var encounters_behind = until90 - total_enconters;
    $('#until90').text(encounters_behind);

    var readableProb = 1/prob; // 1/prob its a way to represent more "humanly" the probability
    $('#probability').text('1/'+readableProb.toFixed(2)); //and display that.
}

function NinetyPercentAt(prob) {
    //this is control, prob of 0 would never break the while loop
    if (prob == 0)
        return 0;

    //start vars at 0
    var binomial = 0;
    var encounters = 0;

    //and incremeant them in the loop until the binomial prob = 90 %
    while (binomial < 0.9) {
        binomial = BinomialProbability(prob, encounters++);
    }

    return encounters-1;
}

function BinomialProbability(prob, cases){
    return 1-(Math.pow(prob, 0) * Math.pow(1-prob, cases));
}

$(document).ready(function() {
    $('#sel_pokemon').autocomplete({
        source: names,
        select: function(event, ui){
            UpdatePokeImg(ui.item.value);
        }
    });
    UpdateData();
});

function ChangeHuntMethod(meth){
    //hide sum component for method specific things and display them only if that method was selected
    //catch combo
    $('#comboMeterRow').hide();
    $('#custom-combo-container').hide('fast')
    $('#lure-check-container').hide('fast')
    //brilliant/ko
    $('#num-ko-container').hide('fast')
    //custom prob
    $('#custom-container').hide('fast')

    if (meth == 'cc') {
        $('#comboMeterRow').show();
        $('#custom-combo-container').show('fast')
        $('#lure-check-container').show('fast')
    } else if (meth == "ko") {
        $('#num-ko-container').show('fast')
    } else if (meth == 'custom'){
        $('#custom-container').show('fast')
    }
    UpdateData();
}

function IncreaseCombo() {
    current_combo++;

    $('#combo').text(current_combo);

    UpdateData();
}

function DecreaseCombo() {
    current_combo--;

    if (current_combo < 0)
        current_combo = 0;

    $('#combo').text(current_combo);

    UpdateData();
}

function UpdatePokeImg(number){
    if (!number.includes('-') && !number.includes("(")){
        number = parseInt(number);
    }
    $(".card-body").show();

    $("#img_poke").attr("src","sprites/" + number + ".png");
    $("#img_poke_shiny").attr("src","sprites/shiny/" + number + ".png");
}
