"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(server) {
    const sockets = new Set();
    // 记录所有套接字
    server.on('connection', function (socket) {
        sockets.add(socket);
        socket.on('close', function () {
            sockets.delete(socket);
        });
    });
    // destroy函数关闭服务并关闭所有套接字
    server.destroy = () => {
        return new Promise((resolve, reject) => {
            // 禁止新请求
            server.on('request', (incomingMessage, outgoingMessage) => {
                if (!outgoingMessage.headersSent) {
                    outgoingMessage.setHeader('connection', 'close');
                }
            });
            // 关闭套接字
            for (const socket of sockets) {
                socket.destroy();
            }
            // 关闭服务
            server.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    return server;
}
exports.default = default_1;
