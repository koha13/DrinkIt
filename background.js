chrome.runtime.onMessage.addListener(hen);
var intervalTime = null;
var freg = null;
var noti = false;
var lastNoti = null;
chrome.storage.sync.get(["freg"], result => {
  if (result.freg) {
    freg = result.freg; //Update freg
  }
  chrome.storage.sync.get(["noti"], result => {
    if (result.noti) {
      noti = result.noti; //Update noti flag
    }

    //Check lastnoti
    chrome.storage.sync.get(["lastNoti"], result => {
      if (result.lastNoti) {
        lastNoti = result.lastNoti;
      }
      if (freg != null && noti === true) {
        if (lastNoti != null) {
          let now = new Date().getTime();
          let temp = freg * 60 * 1000 - ((now - lastNoti) % (freg * 60 * 1000));
          setTimeout(() => {
            sendNotiNow(freg);
          }, temp);
        } else sendNoti(freg);
      }
    });
  });
});

function hen(message, sender, sendResponse) {
  if (message.msg == "hen") {
    //Set freg to storage
    chrome.storage.sync.set({ freg: message.freg }, function() {
      freg = message.freg;
    });
    chrome.storage.sync.set({ noti: true }, function() {
      noti = true;
    });

    clearInterval(intervalTime);
    sendNotiNow(message.freg);
  } else if (message.msg == "dung") {
    //Stop interval
    chrome.storage.sync.set({ noti: false });
    noti = false;
    clearInterval(intervalTime);
  } else if (message.msg == "fetchData") {
    //Send init message to update popup
    chrome.runtime.sendMessage({
      msg: "init",
      data: {
        noti: noti,
        freg: freg
      }
    });
  }
}

function sendNoti(fregTemp) {
  var notiConfig = {
    type: "basic",
    iconUrl: "icon.png",
    title: "DrinkIt",
    message: "Let drink!"
  };
  //Set interval send noti
  intervalTime = setInterval(() => {
    chrome.notifications.create("Drink", notiConfig, function() {
      chrome.storage.sync.set({ lastNoti: new Date().getTime() });
    });
  }, fregTemp * 60 * 1000);
}
function sendNotiNow(fregTemp) {
  var notiConfig = {
    type: "basic",
    iconUrl: "icon.png",
    title: "DrinkIt",
    message: "Let drink!"
  };
  chrome.notifications.create("Drink", notiConfig, function() {
    let time = new Date().getTime();
    chrome.storage.sync.set({ lastNoti: time });
    lastNoti = time;
  });
  sendNoti(fregTemp);
}
