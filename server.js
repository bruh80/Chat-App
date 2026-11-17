import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;
const server = http.createServer((req, res) => {
    fs.readFile('./public/index.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});
const wss = new WebSocketServer({server});
const toall = (payload) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
        };
    });
};
    wss.on("connection" , (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",);
    toall({ "type" : "system", "text": `${username} joined` })
    socket.on("message", (data) => {
        const message = JSON.parse(data);
        toall({ "type": "chat", "username": message.username, "text": message.text })
    });
    socket.on("close", () => {
        toall({ "type": "system", "text": `${username} left` })
    });
});
server.listen(PORT, callback => {
    console.log('Chat server running at http://localhost:3001')
})