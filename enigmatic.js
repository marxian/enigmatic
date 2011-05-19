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

function $(id){
    return document.getElementById(id);
    }

function encrypt(type){

    // check input
    var input=$(type+'input').value.toUpperCase().replace(' ','');
    if (!input.match(/^[A-Z]+$/i)){
        showError('The '+(type=='dec_' ? 'cipher' : 'plain')+'text must only contain the letters A-Z.');
        }
    
    // check plugboard
    var plug=[].slice.call($(type+'plugboard').getElementsByTagName('select'));
    var charmaps=[[],[]];
    plug.forEach(function(s, i){
        charmaps[i % 2 ? 1 : 0].push(s.options[s.selectedIndex].value);
        });
    
    if (charmaps[0].concat(charmaps[1]).join('').match(/(.).*\1/)){
        showError('The '+(type=='dec_' ? 'receiver' : 'sender')+'\'s plugboard cannot connect the same character twice.');
        return;
        }
        
    // check rotors
    var rotor=[].slice.call($(type+'rotors').getElementsByTagName('select'));
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
        showError('The '+(type=='dec_' ? 'receiver' : 'sender')+' cannot use the same rotor twice.');
        return;
        }
        
    // get ring
    var ring=[].slice.call($(type+'rings').getElementsByTagName('select')).map(function(r){
        return r.options[r.selectedIndex].value;
        });
        
    var enigma=new Enigma();
    enigma.plugboard=new CharMap(charmaps[0], charmaps[1]);
    enigma.rotors.push(new Rotor(conf.rotors[(rotorSlot[0]*1)-1].slice(), Rotor.alphabet.indexOf(rotorPos[0]), Rotor.alphabet.indexOf(ring[0])));
    enigma.rotors.push(new Rotor(conf.rotors[(rotorSlot[1]*1)-1].slice(), Rotor.alphabet.indexOf(rotorPos[1]), Rotor.alphabet.indexOf(ring[1])));
    enigma.rotors.push(new Rotor(conf.rotors[(rotorSlot[2]*1)-1].slice(), Rotor.alphabet.indexOf(rotorPos[2]), 0));
    enigma.reflector=new CharMap(conf.reflector[0], conf.reflector[1]);
    
    $(type+'output').value=enigma.translate(input);
    
    }
    
function showError(msg){
var e=$('error');
e.innerHTML=msg;
e.style.display='block';
setTimeout(function(){
    e.style.display='none';
    }, 4000);
}
    
function toggle(bttn){
var s=bttn.innerHTML.match(/show/i);
bttn.innerHTML=(s ? 'Hide' : 'Show')+' settings';
bttn.parentNode.parentNode.getElementsByTagName('div')[0].style.display=s ? 'block' : 'none';
}

function send(){
$('dec_input').value=$('enc_output').value;
}