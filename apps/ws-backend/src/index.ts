import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });
function checkUser(token:string): string | null {
    const decoded = jwt.verify(token, JWT_SECRET);
    if(!decoded || !(decoded as JwtPayload).userId){
        return null;
    }
    return (decoded as JwtPayload).userId;
}

wss.on("connection", (ws, request) => {
    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";

    const userId = checkUser(token);
    if(!userId){
        ws.close();
    }

    
    ws.on("message", (message) => {
        ws.send("Pong");
    });
    
});

