import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket;
    userId: string;
    rooms: string[];
}

const users: User[] = [];

function checkUser(token:string): string | null {
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded || !(decoded as JwtPayload).userId){
            return null;
        }
        return (decoded as JwtPayload).userId;
    } catch(error){
        return null;
    }
}   

wss.on("connection", (ws, request) => {
    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";

    const userId = checkUser(token);
    if(userId == null){
        ws.close();
        return;
    }

    users.push({
        ws,
        userId,
        rooms: []
    });

    
    ws.on("message", (message) => {
        const parsedData = JSON.parse(message.toString());

        if(parsedData.type === "join_room"){
            const user = users.find(user => user.userId === userId);
            if(user){
                user.rooms.push(parsedData.roomId);
            }
        }
        else if(parsedData.type === "leave_room"){
            const user = users.find(user => user.userId === userId);
            if(!user){
                return;
            }
            user.rooms = user.rooms.filter(room => room === parsedData.room);
            
        }
        else if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message
                    }));
                }
            });
        }
    
    }
    );
    
});

