/**
* Engima.js
*
*
* author: Graham Bradley <hello@gbradley.com>
* copyright: 2011 Graham Bradley <hello@gbradley.com>
* license: Creative Commons Attribution-NonCommercial http://creativecommons.org/licenses/by-nc/3.0/
*/

if (!Array.prototype.indexOf){
	Array.prototype.indexOf=function(elt,from){
		var len=this.length;
		from=from || 0;
		for (;from<len;from++){
			if (from in this && this[from]===elt){
				return from;
				}
			}
		return -1;
		}
	}

var CharMap=function(setA, setB){
	if (setA.length!=setB.length){
		throw new Error("Each CharMap set must be of equal lengths");
		}
	else if (new RegExp("["+setA.join('')+"]").test(setB.join(''))){
		throw new Error("CharMap sets cannot contain characters from another set");
		}
	this.setA=setA;
	this.setB=setB;
	};
	
CharMap.prototype.swap=function(c){
	var i=this.setA.join('').indexOf(c);
	if (i>=0){
		return this.setB[i];
		}
	i=this.setB.join('').indexOf(c);
	return i>=0 ? this.setA[i] : c;
	};

var Rotor=function(output, start, ring){
	this.input=this.constructor.alphabet.split('');
	this.output=output;
	while (start--){
		this.advance(true);
		}
	this.ring=ring;
	this.counter=0;
	};
	
Rotor.prototype.encipher=function(c){
	return this.output[this.input.indexOf(c)];
	};
		
Rotor.prototype.decipher=function(c){
	return this.input[this.output.indexOf(c)];
	};	

Rotor.prototype.advance=function(all){
	this.output.unshift(this.output.pop());
	if (all){
		this.input.unshift(this.input.pop());
		}
	this.counter++;
	if (this.counter==this.input.length){
		this.counter=0;
		}
	return this.counter==this.ring;
	};
	
var Enigma=function(){
	this.plugboard=null;
	this.rotors=[];
	this.reflector=null;
	};
	
Enigma.prototype.translate=function(input){
	input=input.split('');
	var output=[], i=j=0, k=input.length, l=this.rotors.length, advance, c;
	for (i; i<k; i++){
			
		c=input[i];

		// pass the character through the plugboard
		c=this.plugboard.swap(c);
			
		// pass the character through each rotor.
		for (j=0; j<l; j++){
			c=this.rotors[j].encipher(c);
			}
				
		// pass it through the reflector
		c=this.reflector.swap(c);
			
		// and now back through the rotors in reverse
		j=l;
		while (j--){
			c=this.rotors[j].decipher(c);
			}
				
		// and finally the plugboard in reverse
		c=this.plugboard.swap(c);
				
		output.push(c);
			
		// now advance the rotors
		advance=true;
		for (j=0; j<l; j++){
			if (advance){
				advance=this.rotors[j].advance();
				}
			}
			
		}
	return output.join('');
	};
	
Rotor.alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ';