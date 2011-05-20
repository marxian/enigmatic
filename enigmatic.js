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
    // If we have cipher text we'll cheat an input character at a time
    $.each(urlParams.ciphertext.split(''), function(i,v){
    	setTimeout(function(){ 
    		en2(v);
    	}, 500 + i * 500);
    });
}


$('#transmitFB').bind('click', function(){
    publishCipherText($('#output').val());
    return false;
});

$('#transmitTW').bind('click', function(){
	var messagetext = $('#output').val();
	var ciphertext = messagetext.replace(/ /g, '');
    var url = 'http://twitter.com/share?';
    url += 'url=http%3A%2F%2Fenigmatic.neontribe.co.uk%3Fciphertext%3D';
    url += ciphertext;
    url += '&text=';
    url += messagetext.replace(/ /g, '+');
    url += '+%23enigmatic+%23bpark';
    window.open(url,'Tweet','width=400,height=300');
    return false;

});

enigmatic.bind('inputEncrypted', function(){
    if ($('#output').val().length > 105) {
        alert('Your message is too long for Twitter transmission');
        $('#transmitTW').hide();
    } else {
        $('#transmitTW').show();
    }
});

