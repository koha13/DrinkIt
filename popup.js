document.getElementById("hen").addEventListener("click", function hen() {
  let freg = document.getElementById("in").value;
  if (freg > 0) {
    chrome.runtime.sendMessage({
      msg: "hen",
      freg: freg
    });
    let p = document.getElementById("status");
    p.innerHTML = "On";
    p.style.color = "blue";
  }
});

document.getElementById("dung").addEventListener("click", function() {
  chrome.runtime.sendMessage({
    msg: "dung"
  });
  let p = document.getElementById("status");
  p.innerHTML = "Off";
  p.style.color = "red";
});

chrome.runtime.onMessage.addListener(init);

function init(message, sender, sendResponse) {
  if (message.msg == "init") {
    let freg = message.data.freg;
    document.getElementById("in").value = freg;
    let noti = message.data.noti;
    if (noti === true) {
      let p = document.getElementById("status");
      p.innerHTML = "On";
      p.style.color = "blue";
    }
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  chrome.runtime.sendMessage({ msg: "fetchData" });
});
