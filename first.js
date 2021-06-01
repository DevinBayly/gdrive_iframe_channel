var channel = new MessageChannel()

var iframe = document.querySelector("iframe")
iframe.onload =()=> {
    var port = channel.port1
    port.onmessage = onMessage
    iframe.contentWindow.postMessage("start","*",[channel.port2])

}

function onMessage(e) {
    console.log("first got",e.data)

}