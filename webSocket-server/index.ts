import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080});


interface User{
    roomId:string;
    name:string
}

const userSocketMapping = new Map<WebSocket,User>();

wss.on("connection",(socket) => {
    socket.on("message",(message) => {
        const parsedMessage = JSON.parse(message.toString());

        if(parsedMessage.type === "join"){
            userSocketMapping.set(socket,{
                roomId:parsedMessage.payload.roomId,
                name:parsedMessage.payload.name
            });
        }

        if(parsedMessage.type === "chat"){
            const currentUser = userSocketMapping.get(socket);

            if(currentUser){
                userSocketMapping.forEach((user,userSocket) => {
                    if(user.roomId === currentUser.roomId){
                        try{
                            userSocket.send(
                                JSON.stringify({
                                    type:"chat",
                                    payload:parsedMessage.payload,
                                })
                            )
                        }catch(err){
                            console.error("Failed to send message",err)
                        }
                    }
                })
            }
        }

        socket.on("close", () => {
            userSocketMapping.delete(socket)
        })
    })
})