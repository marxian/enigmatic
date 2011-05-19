var Config = null; 

function facebookInit(config) {
  Config = config;
  FB.init({
    appId: Config.appId,
    xfbml: true,
    channelUrl:
      window.location.protocol + '//' + window.location.host + '/channel.html'
  });
  FB.Canvas.setAutoResize();

}

function goHome() {
  top.location = 'http://apps.facebook.com/' + Config.canvasName + '/';
}

function publishCipherText(ciphertext) {
  var decrypt_link = 'http://apps.facebook.com/' + Config.canvasName + '/?ciphertext=' + ciphertext.replace(/ /g, '');
  FB.ui({
    message:ciphertext,
    link:decrypt_link,
    picture: 'http://enigmatic.neontribe.co.uk/images/post_icon.jpg',
    name:'Enigmatic',
    caption:'{*actor*} encrypted this message with an Enigma machine',
    description:'You can use the \"Decrypt\" link to try to find out what they posted.',
    method: 'stream.publish',
    action_links: [{
      text: 'Decrypt',
      href: decrypt_link
    }]
  });
}

