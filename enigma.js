// Enigma M4: Rotors I-VIII, wheels Beta & Gamma, thin reflector wheels B & C, ETW(I)
 
// === Declarations ===
// --- Fix values ---
var abc       = 'abcdefghijklmnopqrstuvwxyz'; // ordered alphabet
 
var walzeI    = 'ekmflgdqvzntowyhxuspaibrcj'; // Walze I (Rotor)
var walzeII   = 'ajdksiruxblhwtmcqgznpyfvoe'; // Walze II (Rotor)
var walzeIII  = 'bdfhjlcprtxvznyeiwgakmusqo'; // Walze III (Rotor)
var walzeIV   = 'esovpzjayquirhxlnftgkdcmwb'; // Walze IV (Rotor)
var walzeV    = 'vzbrgityupsdnhlxawmjqofeck'; // Walze V (Rotor)
var walzeVI   = 'jpgvoumfyqbenhzrdkasxlictw'; // Walze VI (Rotor) 
var walzeVII  = 'nzjhgrcxmyswboufaivlpekqdt'; // Walze VII (Rotor)
var walzeVIII = 'fkqhtlxocbjspdzramewniuygv'; // Walze VIII (Rotor)
var walzebeta = 'leyjvcnixwpbqmdrtakzgfuhos'; // Walze Beta (Greek wheel)
var walzegamma= 'fsokanuerhmbtiycwlqpzxvgjd'; // Walze Gamma (Greek wheel)
var ukbduenn  = 'enkqauywjicopblmdxzvfthrgs'; // UKW B "thin" (fixed reflector)
var ukcduenn  = 'rdobjntkvehmlfcwzaxgyipsuq'; // UKW C "thin" (fixed reflector)
var etw = abc; // Entry wheel (fixed, no permutation)
 
var notch = 'rfwkaaaa';  // Notches for engaging adjacent rotor to the left
var winfo = new Array ('Engages at: ',
  'Q|R','E|F','V|W','J|K','Z|A','Z|A, M|N','Z|A, M|N','Z|A, M|N');
var wname = new Array ('I','II','III','IV','V','VI','VII','VIII');
var gwname = new Array('&beta;','&gamma;');
var oldqwertz = 'QWERTZUIOASDFGHJKPYXCVBNML'; // Enigma keyboard layout
 
// --- End fix values ---
 
// -- Selection + Defaults --
var walz01 = walzeI, walz02 = walzeII, walz03 = walzeIII; // 3 selected rotors (of 8): walz01: rightmost (fast), walz02: middle, walz03: left. (Initial/reset values)
var walz1 = walz01, walz2 = walz02, walz3 = walz03; // inner wiring (for ring setting)
var wlz1 = walz1, wlz2 = walz2, wlz3 = walz3; // 3 rotors to set (initial values)
var walzg0 = walzebeta, walzg = walzg0, wlzg = walzg; // Greek wheels, like above
 
var n1 = abc.indexOf(notch.charAt(0)), n2 = abc.indexOf(notch.charAt(1)); // Notches of the two rightmost rotors
var n11 = n1, n21 = n2; // Second notch (set as equal to first)
 
var ukw = ukbduenn; // Preset reflector (UKW B 'thin')
 
var w1set = 65, w2set = 65, w3set = 65; // Rotor position 'A' (real)
var w1out = 65, w2out = 65, w3out = 65; // Rotor pos. 'A' (displayed)
var r1set = 0, r2set = 0, r3set = 0; // ring setting '1'
var wgset = 65, rgset = 0; // Greek wheel (diplay + setting)
var kcheck = ''; // pairs of plugs
 
var swp = abc, gesteckert = false; // plugboard configuration
var ringst = false;  // hide 'Ring settings'
var qwertzu = true; // show QWERTZU keyboard
var monitor = false; 
 
// - Initiate dynamic values -
var w1 = wlz1, w2 = wlz2, w3 = wlz3; // snaphot of rotor positions
var lastkey = -1;  // for QWERTZU display
var coded = 0; // coded characters count
var reset1 = true, reset2 = true, reset3 = true; // for blocking rotor settings in textfield input mode, see set()
 
// === End declarations ===
 
 
// ====== Functions ======
 
function info() {
  alert('\tEnigma M4 Emulator '+document.getElementsByName("version")[0].content+'\n\t(c) 2007-2009 by Daniel Palloks\n\nInfos: http:\/\/people.physik.hu-berlin.de\/~palloks\/js\/enigma\/\n\nThis software and source code may be used, distributed and modified freely as long as (1) my authorship remains acknowledged, (2) any modification is properly indicated, (3) the freeware\/ open source status and the conditions for distribution and modification remain unchanged. A copy of this statement must be distributed together with the software.\nThis software is provided \"as is\". The author will not be liable for any damage - direct, indirect or consequential - resulting from the use of this software.');
}
 
function neu() {
// if the browser's Reload button is used...
  document.f.reset(); // clear wheel selection and rotor settings form
  wlzReset(); rngReset(); // keep but deactivate plug settings...
  for (var i=0; i<13; i++) { //... something plugged: mark activation button
    if (document.s.stf[i].value != '') { stbMark(); break }
  }
}
 
 
function wlzReset() {
  wlz1 = walz1; wlz2 = walz2; wlz3 = walz3; wlzg = walzg; //there could still be a ring setting!
  w1 = wlz1; w2 = wlz2; w3 = wlz3;
  w1set = 65; w2set = 65; w3set = 65;  // (if omitted, reset to last manual position)
  wgset = 65;
  w1out = 65; w2out = 65; w3out = 65; 
  reset1 = true; reset2 = true; reset3 = true;
  document.f.w1.value = String.fromCharCode(w1set);
  document.f.w2.value = String.fromCharCode(w2set);
  document.f.w3.value = String.fromCharCode(w3set);
  document.f.wg.value = String.fromCharCode(wgset);
  wlzAktuellShow(); viewKey();
}
 
 
function rngReset() { 
  r1set = 0; r2set = 0; r3set = 0; rgset = 0;
  document.f.r1.value = String(r1set +1);
  document.f.r2.value = String(r2set +1);
  document.f.r3.value = String(r3set +1);
  document.f.rg.value = String(rgset +1);
  walz1 = walz01; walz2 = walz02; walz3 = walz03; walzg = walzg0;
  wlz1 = walz1; wlz2 = walz2; wlz3 = walz3; wlzg = walzg; 
  wlzStellShow(); viewKey();
}
 
 
function steckReset () { 
  stbMark() // nur Effekt
  swp = abc; kcheck= '';
  for (var i=0; i<13; i++) 
    document.getElementsByName('stf')[i].value= '';
  setTimeout('steck()',150);
}
 
 
function wlzAktuellShow () {
  document.getElementById('walzen').innerHTML= wlz3+' &nbsp; &nbsp; '+wlz2+' &nbsp; &nbsp; '+wlz1+'<br>'+w3+' &nbsp; &nbsp; '+w2+' &nbsp; &nbsp; '+w1;
}
 
function wlzStellShow () {
  document.getElementById('walzen').innerHTML= walz3+' &nbsp; &nbsp; '+walz2+' &nbsp; &nbsp; '+walz1+'<br>'+wlz3+' &nbsp; &nbsp; '+wlz2+' &nbsp; &nbsp; '+wlz1;
}
 
 
function wgsel (sel) { 
  wgset = 65; document.f.wg.value="A";
  rgset = 0; document.f.rg.value="1";
  switch(sel) {
    case "1": walzg0 = walzebeta; break;
    case "2": walzg0 = walzegamma; break;
  }
  walzg = walzg0; wlzg = walzg;
  document.getElementById('rngg').innerHTML= gwname[sel-1];
  wlzStellShow (); viewKey();
}
 
function w3sel (sel) { 
  w3set = 65; w3out = 65; document.f.w3.value="A";
  r3set = 0; document.f.r3.value="1";
  walz03 = wselect(sel); walz3 = walz03; wlz3 = walz3; //w3 = wlz3;
  reset3 = true;
  document.getElementById('rng3').innerHTML= wname[sel-1];
  wlzStellShow (); viewKey();
}
 
function w2sel (sel) {
  w2set = 65; w2out = 65; document.f.w2.value="A";
  r2set = 0; document.f.r2.value="1";
  walz02 = wselect(sel); walz2 = walz02; wlz2 = walz2; //w2 = wlz2;
  n2 = abc.indexOf(notch.charAt(parseInt(sel-1))); // assign proper notch
  n21 = (sel > 5)? abc.indexOf('n') : n2; // VI-VIII have notches at M|N and Z|A!
  reset2 = true;
  document.getElementById('rng2').innerHTML= wname[sel-1];
  wlzStellShow (); viewKey();
}
 
function w1sel (sel) { 
  w1set = 65; w1out = 65; document.f.w1.value="A";
  r1set = 0; document.f.r1.value="1";
  walz01 = wselect(sel); walz1 = walz01; wlz1 = walz1; //w1 = wlz1;
  n1 = abc.indexOf(notch.charAt(parseInt(sel-1)));
  n11 = (sel > 5)? abc.indexOf('n') : n1;
  reset1 = true;
  document.getElementById('rng1').innerHTML= wname[sel-1];
  wlzStellShow (); viewKey();
}
 
 
function wselect (sel) {
  var w;
  switch(sel) {
    case "1": w = walzeI; break;
    case "2": w = walzeII; break;
    case "3": w = walzeIII; break;
    case "4": w = walzeIV; break;
    case "5": w = walzeV; break;
    case "6": w = walzeVI; break;
    case "7": w = walzeVII; break;
    case "8": w = walzeVIII; break;
  } 
  return w;
}
 
 
function ukwlz(sel) {
  ukw = (sel=="B")? ukbduenn : ukcduenn;
  //alert('Reflector '+sel+' \'thin\':\n'+ukw);
  viewKey();
}
 
 
function set(s) {
  if (document.f.inp.value != '' && !(reset1 && reset2 && reset3)) return 0; // locked
  var n = s.charCodeAt(0);
  if (n==43) return 1;
  if (n==45) return -1;
  if (n < 65 || n > 90 || s=='') return 0;
  return n;
}
 
function setr(s) {
  var n=0;
  if (!(isNaN(s))) {
    n = parseInt(s) +1; // since '+' button has value '1' already. (Re-shift later!!)
    if (n==1) n=2; // Input '0' becomes '1' (i.e., '2' in this case)
    else if (n < 1 || n > 27 || s=='') n= 0;
  }
  return n;
}
 
function setg(n) {
  if (n==0) { // restore display
    if (ringst) document.f.rg.value = rgset +1;
    else document.f.wg.value = String.fromCharCode(wgset);
    return;
  }
  if (ringst) { 
    if (n > 1 && n < 28) n -= rgset +2; //distance new to old (n in rset was increased by 2!)
    rgset = (rgset + n) % 26; if (rgset < 0) rgset= 26 + n; 
    document.f.rg.value = String(rgset + 1);
    walzg = rot(walzg,-n); wlzg =rot(wlzg,-n); 
  }
  else {
    if (n > 64 && n < 91) n -= wgset; // distance new to old value
    wgset = 65 + (wgset - 65 + n) % 26; if (wgset< 65) wgset= 91 + n; 
    document.f.wg.value = String.fromCharCode(wgset);
    wlzg = rot(wlzg,n);
  }
  document.getElementById('walzen').innerHTML= walz3+' &nbsp; &nbsp; '+walz2+' &nbsp; &nbsp; '+walz1+'<br>'+wlz3+' &nbsp; &nbsp; '+wlz2+' &nbsp; &nbsp; '+wlz1;
  document.getElementById('status2').innerHTML= w3set-65 +'-' +r3set;
  viewKey();
}
 
 
function set3(n) {
  if (n==0) {
    if (ringst) document.f.r3.value = r3set +1;
    else document.f.w3.value = String.fromCharCode(w3out);
    return;
  }
  if (ringst) { // Ring setting
    if (n > 1 && n < 28) n -= r3set +2; // n in rset() was increased by 2 wrt. r3set!
    r3set = (r3set + n) % 26; if (r3set < 0) r3set= 26 + n; 
    document.f.r3.value = String(r3set + 1);
    walz3 = rot(walz3,-n); wlz3 =rot(wlz3,-n);
  }
  else { // Rotor setting
    if (n > 64 && n < 91) n -= w3out; // distance new to old value
    w3set = 65 + (w3set - 65 + n) % 26; if (w3set< 65) w3set= 91 + n;
    w3out = 65 + (w3out - 65 + n) % 26; if (w3out< 65) w3out= 91 + n;
    document.f.w3.value = String.fromCharCode(w3out);
    wlz3 = rot(wlz3,n);
  }
  document.getElementById('walzen').innerHTML= '<b>'+walz3+'<\/b> &nbsp; &nbsp; '+walz2+' &nbsp; &nbsp; '+walz1+'<br><b>'+wlz3+'<\/b> &nbsp; &nbsp; '+wlz2+' &nbsp; &nbsp; '+wlz1;
  document.getElementById('status2').innerHTML= w3set-65 +'-' +r3set;
  viewKey();
}
 
 
function set2(n) {
  if (n==0) {
    if (ringst) document.f.r2.value = r2set +1;
    else document.f.w2.value = String.fromCharCode(w2out);
    return;
  }
  if (ringst) { 
    if (n > 1 && n < 28) n -= r2set +2;
    r2set = (r2set + n) % 26; if (r2set < 0) r2set= 26 + n; 
    document.f.r2.value = String(r2set + 1);
    walz2 = rot(walz2,-n); wlz2 =rot(wlz2,-n);
  }
  else {
    if (n > 64 && n < 91) n -= w2out;
    w2set = 65 + (w2set - 65 + n) % 26; if (w2set< 65) w2set= 91 + n;
    w2out = 65 + (w2out - 65 + n) % 26; if (w2out< 65) w2out= 91 + n;
    document.f.w2.value = String.fromCharCode(w2out);
    wlz2 = rot(wlz2,n);
  }
  document.getElementById('walzen').innerHTML= walz3+' &nbsp; &nbsp; <b>'+walz2+'<\/b> &nbsp; &nbsp; '+walz1+'<br>'+wlz3+' &nbsp; &nbsp; <b>'+wlz2+'<\/b> &nbsp; &nbsp; '+wlz1;
  document.getElementById('status2').innerHTML= w2set-65 +'-' +r2set;
  viewKey();
}
 
 
function set1(n) {
  if (n==0) {
    if (ringst) document.f.r1.value = r1set +1;
    else document.f.w1.value = String.fromCharCode(w1out);
    return;
  }
  if (ringst) { 
    if (n > 1 && n < 28) n -= r1set +2;
    r1set = (r1set + n) % 26; if (r1set < 0) r1set= 26 + n; 
    document.f.r1.value = String(r1set + 1);
    walz1 = rot(walz1,-n); wlz1 =rot(wlz1,-n);
  }
  else {
    if (n > 64 && n < 91) n -= w1out;
    w1set = 65 + (w1set -65 + n) % 26; if (w1set< 65) w1set= 91 + n;
    w1out = 65 + (w1out -65 + n) % 26; if (w1out< 65) w1out= 91 + n;
    document.f.w1.value = String.fromCharCode(w1out);
    wlz1 = rot(wlz1,n);
  }
  document.getElementById('walzen').innerHTML= walz3+' &nbsp; &nbsp; '+walz2+' &nbsp; &nbsp; <b>'+walz1+'<\/b><br>'+wlz3+' &nbsp; &nbsp; '+wlz2+' &nbsp; &nbsp; <b>'+wlz1+'<\/b>';
  document.getElementById('status2').innerHTML= w1set-65 +'-' +r1set;
  viewKey();
}
 
 
function switchWlzSettings (sw) {
  if (sw == false) {
    ringst = true; 
    document.getElementById("walz").style.display= "none";
    document.getElementById("rngst").style.display= "";
    wlzStellShow();
  }
  else {
    ringst = false;
    document.getElementById("rngst").style.display= "none";
    document.getElementById("walz").style.display= "";
    wlzAktuellShow();
  }
}
 
 
function walzenrot () {
  if (document.f.rotieren.checked == true)
    document.getElementById("walzenrot").innerHTML= ' Rotate wheels';
  else
    document.getElementById("walzenrot").innerHTML= '<span style=background-color:#c33>&nbsp;Rotors locked!&nbsp;<\/span>';
}
 
 
function steck () {
  var stest0, stest1, k0, k1; 
  kcheck= ''; 
  swp = abc;
  document.getElementById("stb").style.fontWeight = 'normal'; // button reset
  document.getElementById("stb").style.color = '#000';
  for (var i=0; i<13; i++) {
    stest0 = document.getElementsByName('stf')[i].value.charAt(0).toLowerCase(); 
    stest1 = document.getElementsByName('stf')[i].value.charAt(1).toLowerCase();
    if (stest1 == stest0) { document.getElementsByName('stf')[i].value= ''; stest0 = stest1 = '' }
    // Validate... 
    if (stest0 != '') {
      if ((stest0.charCodeAt(0) < 97 || stest0.charCodeAt(0) > 122) || (stest1.charCodeAt(0) < 97 || stest1.charCodeAt(0) > 122) || stest1 == '') { 
        alert('Error! (Field '+String(i+1)+')'); kcheck=''; return(false); }
      // Validate2: search for doppelgangers...
      if (kcheck.lastIndexOf(stest0) >= 0 || kcheck.lastIndexOf(stest1) >= 0 ) {
        alert('Error! Double use (field '+String(i+1)+').'); kcheck=''; return(false); }
      else {
        kcheck = stest0 + stest1 + kcheck;
        // build swap string (using replace function srepl())...
        k0 = abc.indexOf(stest0), k1 = abc.indexOf(stest1);
        swp = srepl(swp,k0,stest1);
        swp = srepl(swp,k1,stest0);
      }//-if !=''
    } //-for
  }
  if (swp != abc) gesteckert = true;
  viewKey();
  return;
}
 
 
function srepl (s, nr, c) {
  if (nr==0) s = c + s.substring(1);
  else s = s.substring(0, nr) + c + s.substring(nr + 1);
  return(s);
}
 
 
function stbMark() {
  document.getElementById("stb").style.fontWeight = 'bold';
  document.getElementById("stb").style.color = '#a52a2a';
}
 
 
function fadeSt () {
  if (document.k.stl.value=="Hide plugboard") {
    document.getElementById("stecker").style.display= "none";
    document.k.stl.value= "Show plugboard";
  }
  else { 
  document.getElementById("stecker").style.display= "";
  document.k.stl.value= "Hide plugboard";
  }
}
 
 
function fadeInp() {
  document.f.out.value= ''; document.f.inp.value= ''; coded = 0;
  if (qwertzu) { // Switch to TXT
    qwertzu = false;
    document.getElementById("qwertzu").style.display = "none";
    document.getElementById("txtfeld").style.display = "";
    document.k.qw.value= "QWERTZU keys";
    if (ringst) { ringst = false; var t = true } // apply next line only to rotor pos.
    set1(w1set); set2(w2set); set3(w3set); // Reset to last home positions 
    if (t) ringst = true; // reset var ringst if changed 2 lines up
  }
  else { // Switch to QWERTZU
    qwertzu = true;
    document.getElementById("txtfeld").style.display= "none";
    document.getElementById("qwertzu").style.display= "";
    document.k.qw.value= "Text input field ";
    if (lastkey > -1) document.getElementsByName('kqw')[lastkey].style.color= 'gray';
    enigma(' '); // Reset to last home positions
  }
  w1set = w1out; w2set = w2out; w3set = w3out;
  viewKey();
}
 
 
function fade () { 
  if (document.k.knopf.value==" Hide monitor ") {
    document.getElementById("monitor").style.display= "none";
    document.k.knopf.value= " Show monitor ";
    monitor = false;
  }
  else {
  document.getElementById("monitor").style.display= "";
  document.k.knopf.value= " Hide monitor ";
  monitor = true;
  }
}
 
 
function ttw(s) {
  if (ringst) return ( '"' +abc.charAt(Number(s.toLowerCase()) -1).toUpperCase() +'"' );
  else return ( '"' +String(abc.indexOf(s.toLowerCase()) +1) +'"' );
}
 
function tts(s) {
  var s0= s.charAt(0), s1= s.charAt(1), n0= s0.charCodeAt(0), n1= s1.charCodeAt(0);
  if (s!='' && n0 > 64 && n0 < 91 && n1 > 64 && n1 < 91) return ( '"' +String(abc.indexOf(s0.toLowerCase()) +1) +'/' +String(abc.indexOf(s1.toLowerCase()) +1) +'"' );
  else return ('');
}
 
 
function viewKey() {
  var rg1=String(r1set +1), rg2=String(r2set +1), rg3=String(r3set +1), rgg=String(rgset +1);
  rg1= (rg1.length==2)? rg1 : '0'+rg1;
  rg2= (rg2.length==2)? rg2 : '0'+rg2;
  rg3= (rg3.length==2)? rg3 : '0'+rg3;
  rgg= (rgg.length==2)? rgg : '0'+rgg;
  if (qwertzu) {
    w1set = w1out; w2set = w2out; w3set = w3out; // After setting wheels in QWERTZU: set current values as home pos.
  }
  var wg = new Array ( String.fromCharCode(wgset), String.fromCharCode(w3set), String.fromCharCode(w2set), String.fromCharCode(w1set) );
  if (kcheck=='') kcheck = ' - -';
  var k='Wheels: ';
  k= (ukw == ukbduenn)? k+'B.' : k+'C.';
  k= (walzg0 == walzebeta)? k+'Beta ' : k+'Gamma ';
  k+= document.getElementById("rng3").innerHTML +' '+ document.getElementById("rng2").innerHTML +' '+ document.getElementById("rng1").innerHTML + ' (' + wg +') / ';
  k+= 'Ring setting '+rgg+' '+rg3+' '+rg2+' '+rg1+' / ';
  k+= 'Plugged:';
  for (var i=kcheck.length -2; i > -1; i-=2) {
    if (kcheck.charAt(i) != kcheck.charAt(i+1)) k+= ' ' + kcheck.substr(i,2).toUpperCase();
  }
  document.getElementById('key1').innerHTML=k;
}
 
 
 
// ---- MAIN LOOP (Input pane) ----
 
function enigma(s) {
  // always processes the entire text in the pane!
 
  if (monitor) {
    document.getElementById('status0').innerHTML= '<font color=#cc3333>Processing...<\/font>';
    if (s.length > 999) {
      var c= confirm('Warning: Large input text!\nDeactivating the monitor may accelerate the process considerably.\n\'OK\', to continue anyway (window might not close immediately).');
      if (c==false) { document.getElementById('status0').innerHTML= '<font color=#cc3333>Cancelled!<\/font>'; return ''; }
    }
  }
 
  var startzeit = new Date();
 
  document.getElementById('signal').innerHTML = ''; 
  w1out = w1set, w2out = w2set, w3out = w3set; // wheel position set + display
  w1 = wlz1; w2 = wlz2; w3 = wlz3;
  coded = 0;
  var out = '';
  // ... reset rotors + output, as string is being recoded from start each time!
 
  for (var i=0; i < s.length; i++) {
 
    if (s.charCodeAt(i) > 96 && s.charCodeAt(i) < 123) {
 
      reset1 = false; reset2 = false; reset3 = false;
 
      if (document.f.rotieren.checked == true) gear(); //engage rotor
      out = out + kodieren(s.charAt(i));
      if ((coded+1) % 4 ==0) out += ' ';
      coded++;
 
    }
 
    if (monitor)
      document.getElementById('status1').innerHTML = s.charCodeAt(i);
 
  } //-for
  
  document.f.w3.value = String.fromCharCode(w3out);
  document.f.w2.value = String.fromCharCode(w2out);
  document.f.w1.value = String.fromCharCode(w1out);
 
  wlzAktuellShow();
  document.getElementById('status0').innerHTML = '( OK )';
  document.getElementById('status3').innerHTML = coded;
 
  var endzeit = new Date();
  var zeit = endzeit.getTime() - startzeit.getTime();
  document.getElementById('time').innerHTML = zeit/1000 + ' s';
  return(out);
 
}
// ---- End main loop ----
 
 
 
function en2(s) { // QWERTZU Main Loop (text input)...
 
  document.getElementById('status0').innerHTML= '<font color=#cc3333>Processing...<\/font>';
  if (s.length > 1) var start = new Date();
  var l = document.f.out.value.length;
 
  for (var i=0; i < s.length; i++) {
    if (lastkey > -1) document.getElementsByName('kqw')[lastkey].style.color= 'gray';
    var e = en(s.charAt(i).toLowerCase()).toUpperCase(); 
    if (e != '') { 
      var taste = oldqwertz.indexOf(e);
      document.getElementsByName('kqw')[taste].style.color = '#cc0';
      lastkey = taste;
      l++;
      document.f.out.value += e;
      if ((l+1) % 5 == 0) { document.f.out.value += ' '; l++ }
    }
  }
  document.f.inpqw.value = '';
  document.getElementById('status0').innerHTML= '( OK )';
 
  if (s.length > 1) {
    var ende = new Date();
    var zeit = ende.getTime() - start.getTime();
    document.getElementById('time').innerHTML = zeit/1000 +' s';
  }
  // ENIGMATIC ADDITION
  // Call out on character translation - event'd be nice here
  enigmatic.trigger('inputEncrypted');
}
 
 
function en(s) { // QWERTZU Main Loop...
 
  document.getElementById('time').innerHTML= '';
  w3out= document.f.w3.value.charCodeAt(0); 
  w2out= document.f.w2.value.charCodeAt(0); 
  w1out= document.f.w1.value.charCodeAt(0);   
  w1 = wlz1; w2 = wlz2; w3 = wlz3; 
 
  if (monitor) 
    document.getElementById('status1').innerHTML = s.charCodeAt(0); 
 
  if (s.charCodeAt(0) > 96 && s.charCodeAt(0) < 123) {
 
    if (document.f.rotieren.checked == true) gear(); // rotor step
    var out = kodieren(s.charAt(0));
    
    wlz1 = w1; wlz2 = w2; wlz3 = w3; // ... keep advancing
    coded++;
  
    if (monitor) 
      document.getElementById('walzen').innerHTML= walz3+' &nbsp; &nbsp; '+walz2+' &nbsp; &nbsp; '+walz1+'<br>'+w3+' &nbsp; &nbsp; '+w2+' &nbsp; &nbsp; '+w1;
 
    document.f.w3.value = String.fromCharCode(w3out);
    document.f.w2.value = String.fromCharCode(w2out);
    document.f.w1.value = String.fromCharCode(w1out);
 
    document.getElementById('status1').innerHTML = s.charCodeAt(0);
    document.getElementById('status3').innerHTML = coded;
  
    return out;
  
  } //-validate charCode
 
  else return '';
}
 
 
 
// Engage rotor step
function gear() {
 
  w1 = rot(w1,1); 
  w1out++; if (w1out > 90) w1out= 65; // rotor #1 display
  var w1c0 = w1.charAt(0);
 
  if ( w2.charAt(1) == walz2.charAt(n2) || w2.charAt(1) == walz2.charAt(n21) ) { //Switch-over 2-3 & double-stepping, or special case (priority)
    w2 = rot(w2,1); 
    w3 = rot(w3,1);
    w2out++; if (w2out > 90) w2out= 65; 
    w3out++; if (w3out > 90) w3out= 65;
  }
  else if (w1c0 == walz1.charAt(n1) || w1c0 == walz1.charAt(n11)) { // switch-over 1-2
    w2 = rot(w2,1); 
    w2out++; if (w2out > 90) w2out= 65; 
  }
}
 
 
// THIS is the key part!
function kodieren(s) { 
 
    // Effective rotation: distance rotor pos. from home pos. of internal wiring 
    // = <distance rotor pos. from 'A' pos.> - <dist. wiring pos. from '0' pos.>
    var rw1 = w1out - 65 - r1set; if (rw1 < 0) rw1 += 26;
    var rw2 = w2out - 65 - r2set; if (rw2 < 0) rw2 += 26;
    var rw3 = w3out - 65 - r3set; if (rw3 < 0) rw3 += 26;
    var rwg = wgset - 65 - rgset; if (rwg < 0) rwg += 26;
    if (monitor)
      document.getElementById('status2').innerHTML= rwg+' '+rw3+'  '+rw2+'  '+rw1;
 
    var s0 = (gesteckert)? swp.charAt(abc.indexOf(s)) : s; // Plug on entry?
 
    var se = s0; //=etw.charAt(abc.indexOf(s0));
    var s1 = w1.charAt(abc.indexOf(se));  // (ETW is immobile)
    var s2 = w2.charAt( (26 - (rw1 - abc.indexOf(s1))) % 26 );
    var s3 = w3.charAt( (26 - (rw2 - abc.indexOf(s2))) % 26 );
    var sg = wlzg.charAt( (26 - (rw3 - abc.indexOf(s3))) % 26 );
    var su = ukw.charAt( (26 - (rwg - abc.indexOf(sg))) % 26 );
      var t = '<code>RFL &nbsp;W.4 &nbsp; W.3 &nbsp; W.2 &nbsp; W.1 &nbsp; ETW &nbsp; PLG<br>';
      t+=' &#9484;- '+sg+' &lt;-- '+s3+' &lt;-- '+s2+' &lt;-- '+s1+' &lt;-- '+se+' &lt;-- '+s0+' &lt;-- '+s+' (IN)<br> &#9492;&gt; '+su; 
    sg = abc.charAt( wlzg.indexOf(abc.charAt((abc.indexOf(su) +rwg) % 26)) ); 
    s3 = abc.charAt( w3.indexOf(abc.charAt((abc.indexOf(sg) +rw3) % 26)) ); 
    s2 = abc.charAt( w2.indexOf(abc.charAt((abc.indexOf(s3) +rw2) % 26)) );
    s1 = abc.charAt( w1.indexOf(abc.charAt((abc.indexOf(s2) +rw1) % 26)) );
    se = s1; //=abc.charAt( etw.indexOf(s1) ); 
 
    s0 = (gesteckert)? swp.charAt(abc.indexOf(se)) : se; // Plug on exit?
 
      t= t+' --&gt; '+sg+' --&gt; '+s3+' --&gt; '+s2+' --&gt; '+s1+' --&gt; '+se+' --&gt; '+s0+' (OUT)<\/code>'
    if (monitor) document.getElementById('signal').innerHTML= t;
 
    return s0;
}
 
 
function rot (w,n) { 
  return (n>0)? w.substr(n)+ w.substr(0,n) : w.substr(w.length +n) + w.substring(0, w.length +n);
}
