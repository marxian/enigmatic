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
    // Show the decrypt button
    //$('#process').show();
}


$('#transmit').bind('click', function(){
    publishCipherText($('#output').val());
});

