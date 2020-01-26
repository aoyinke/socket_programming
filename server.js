var ws = require("nodejs-websocket")
var PORT = 3000

var clientCount = 0
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function(conn){
    console.log("New connection")
    clientCount++
    conn.nickname = 'user' + clientCount
    var mes = {}
    mes.type = "entering"
    mes.data = conn.nickname + 'comes in'
    broadcast(JSON.stringify(mes))
    conn.on("text",function(str){
        console.log("Received " + str)
        var mes = {}
        mes.type = "message"
        mes.data = conn.nickname + " says: " + str
        broadcast(JSON.stringify(mes))
    })
    conn.on("error",function(err){
        console.log("handle err")
        console.log(err)
    })
    conn.on("close",function(code,reason){
        console.log("Connection closed")
        var mes = {}
        mes.type = "leaving"
        mes.data = conn.nickname + ' leave'
        broadcast(JSON.stringify(mes))
    })
}).listen(PORT)

console.log("websocket server listening on " + PORT)

function broadcast(str){
    server.connections.forEach(function(connection){
        connection.sendText(str)
    })
}