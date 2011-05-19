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

function publishCipherText(message) {
  var decrypt_link = 'http://apps.facebook.com/' + Config.canvasName + '/?ciphertext=' + 'TESTTHIS';
  FB.ui({
    message:message,
    link:decrypt_link,
    name:'Enigma by Bletchley',
    caption:'{*actor*} encrypted this message',
    description:'Follow the link to decrypt',
    method: 'stream.publish',
    action_links: [{
      text: 'Decrypt',
      href: decrypt_link
    }]
  });
}

