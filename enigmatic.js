var urlParams = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       urlParams[d(e[1])] = d(e[2]);
})();

if (urlParams.ciphertext) {
    $('#input').val(urlParams.ciphertext);
}


var conf={
    rotors:[
        ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'],
        ['P','O','I','U','Y','T','R','E','W','Q','L','K','J','H','G','F','D','S','A','M','N','B','V','C','X','Z'],
        ['Q','A','Z','W','S','X','E','D','C','R','F','V','T','G','B','Y','H','N','U','J','M','I','K','O','L','P'],
        ['P','L','O','K','M','I','J','N','U','H','B','Y','G','V','T','F','C','R','D','X','E','S','Z','W','A','Q'],
        ['Z','M','X','N','C','B','V','A','L','S','K','D','J','F','H','G','Q','P','W','O','E','I','R','U','T','Y']
        ],
    reflector:[['P','L','O','K','M','I','J','N','U','H','B','Y','G'], ['V','T','F','C','R','D','X','E','S','Z','W','A','Q']]
    }

function encrypt(){

    // check input
    var input=$('#input').val().toUpperCase().replace(' ','');
    if (!input.match(/^[A-Z]+$/i)){
        showError('The text must only contain the letters A-Z.');
        }
    
    // check plugboard
    var plug=[].slice.call($('#plugboard').find('select'));
    var charmaps=[[],[]];
    plug.forEach(function(s, i){
        charmaps[i % 2 ? 1 : 0].push(s.options[s.selectedIndex].value);
        });
    
    if (charmaps[0].concat(charmaps[1]).join('').match(/(.).*\1/)){
        showError('The plugboard cannot connect the same character twice.');
        return;
        }
        
    // check rotors
    var rotor=[].slice.call($('#rotors').find('select'));
    var rotorSlot=[], rotorPos=[];
    rotor.forEach(function(r, i){
        if (i % 2){
            rotorPos.push(r.options[r.selectedIndex].value);
            }
        else{
            rotorSlot.push(r.options[r.selectedIndex].value);
            }
        });
    
    if (rotorSlot.join('').match(/(.).*\1/)){
        showError('The cannot use the same rotor twice.');
        return;
        }
        
    // get ring
    var ring=[].slice.call($('#rings').find('select')).map(function(r){
        return r.options[r.selectedIndex].value;
        });
        
    var enigma=new Enigma();
    enigma.plugboard=new CharMap(charmaps[0], charmaps[1]);
    enigma.rotors.push(new Rotor(conf.rotors[(rotorSlot[0]*1)-1].slice(), Rotor.alphabet.indexOf(rotorPos[0]), Rotor.alphabet.indexOf(ring[0])));
    enigma.rotors.push(new Rotor(conf.rotors[(rotorSlot[1]*1)-1].slice(), Rotor.alphabet.indexOf(rotorPos[1]), Rotor.alphabet.indexOf(ring[1])));
    enigma.rotors.push(new Rotor(conf.rotors[(rotorSlot[2]*1)-1].slice(), Rotor.alphabet.indexOf(rotorPos[2]), 0));
    enigma.reflector=new CharMap(conf.reflector[0], conf.reflector[1]);

    //$('#output').text(enigma.translate(input));
    writeOutput(enigma.translate(input));
}
    
function showError(msg) {
    var e=$('#error');
    e.html(msg);
    e.show();
    setTimeout(function(){e.hide();}, 4000);
}

function writeOutput(text) {
    var out = [];
    $.each(text.split(''), function(i,v){
        out.push(v);
        if ((i + 1) % 4 == 0) {
            out.push(' ');
        } 
    });
    $('#output').text(out.join(''));
}


$('#settings_toggle').bind('click', function(){
    $('#settings').toggle('slide');
});

$('#input').bind('keyup', function(){
    $('#input').val($('#input').val().toUpperCase().replace(/[^A-Z]+/g,''));
    encrypt();
});

$('#process').bind('click', function(){
    encrypt();
});

$('#transmit').bind('click', function(){
    publishCipherText($('#output').text().replace(/ /g, ''));
});

