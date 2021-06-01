let port
//let idFound = "1kYNEvScgFwv2E8aSr2_KhkSJuXskEFjp"
let idFound = "1ACxmHYEgmUK2kt97jVvV3U-breKy6k_f"
window.addEventListener("message", (e) => {
    // do stuff with gapi
    console.log("e is", e)
    if (e.ports != undefined && e.ports.length > 0) {
        console.log(e.data)
        port = e.ports[0]
        setInterval(() => {
            e.ports[0].postMessage("replying")
        }, 1000)
        port.onmessage = handleMessages
        // perform the get and return
    }
})
function performGet() {
    return fetch(`https://www.googleapis.com/drive/v3/files/${idFound}/?key=${API_KEY}&alt=media`,{
    })
}
function handleMessages(e) {
    if (e.data.match(/savethis /)) {
        // remove the prion
        port.postMessage("got a save this ")
        let d = e.data.replace(/savethis /, "")
        saveToDrive(d)
    }
  if (e.data.match(/loadpls/)) {
        performGet().then(res=> res.json()).then( j=>{
            port.postMessage(`loadedxxx${j.content}`)
        })
  }
}

function saveToDrive(content) {
    let jcontent = {content:content}
    console.log("jcontent is ",jcontent)

    let first = `--uploadboundary
Content-Disposition:form-data;name="metadata";filename="first"
Content-Type: application/json; charset=UTF-8

{"name":"new_notes.json","mimeType":"application/json"}
`
    let second = `--uploadboundary
Content-Disposition:form-data;name="file";filename="blob"
Content-Type: application/json

${JSON.stringify(jcontent)}
--uploadboundary--`
    // make the path include the fileID to update
    fetch(`https://www.googleapis.com/upload/drive/v3/files/${idFound}/?uploadType=multipart&key=${API_KEY}&fields=id`, {
        method: "PATCH",
        headers: {
            "Content-type": "multipart/related; boundary=uploadboundary",
            "Content-Length": (first + second).length,
            "Authorization": "Bearer " + gapi.auth.getToken().access_token
        },
        body: first + second
    }).then(res => res.json()).then(j => {
        console.log(j)
        port.postMessage(`success ${j}`)
    }).catch(e => {
        console.log("error ",e)
        port.postMessage(`nope, error ${e}`)
    })
    // try the gapi.method
}
