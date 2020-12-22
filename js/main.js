var total_enconters = 0;
var probability = 0.00366206467;

function IncreaseEncounter(){
    total_enconters += 1;
    UpdateData();
}

function catchCombo(combo, charm, baseProbability){
    var factor = 1;
    var lure = $('#has_lure')[0].checked;

    //calculate base
    if (charm){
        factor += 2;
    }
    if (lure){
        factor += 1;
    }

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

function BaseProbability(){
    var generation = $('#sel_gen').val();

    if (generation < 6)
        return 8192;
    else
        return 4096;
}

function getProbability(encounters){
    var has_charm = $('#has_charm')[0].checked;
    var method = $('#sel_meth').val();
    var prob = BaseProbability();

    switch (method) {
        case 'cc':
            return catchCombo(encounters, has_charm, prob);
        case 'mm':
            var gen = $('#sel_gen').val();
            return masudaMethod(has_charm, prob, gen);
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

function UpdateData(){
    $('#display_encounters').text(total_enconters);


    var prob = getProbability(total_enconters);
    var binomial = BinomialProbability(prob, total_enconters) * 100;
    $('#binomial').text(binomial.toFixed(3) + '%');
    var readableProb = 1/prob;
    $('#probability').text('1/'+readableProb.toFixed(2));
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

function UpdatePokeImg(number){
    var n = parseInt(number);
    $(".card-body").show();

    $("#img_poke").attr("src","sprites/" + n + ".png");
    $("#img_poke_shiny").attr("src","sprites/shiny/" + n + ".png");
}
