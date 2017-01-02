import Server from 'socket.io';
import Queue from './Queue.js';

var playerQueue = new Queue();

const io = new Server().attach(9999);

// format is 'R', 'P' or 'S'
function play() {
    var player1 = '0';
    var player2 = '0';
    var socket1;
    var socket2;
    var winner;
    function handle(data, playernum) {
        if (playernum == 1) player1 = data;
        else if (playernum == 2) player2 = data;
        console.log("Player " + playernum + " played " + data);
        // only start if both player played
        if (player1 != '0' && player2 != '0') {
            switch(player1) {
                case 'R': switch(player2) {
                    case 'R': winner = 0; break;
                    case 'P': winner = 2; break;
                    case 'S': winner = 1; break;
                }
                break;
                case 'P': switch(player2) {
                    case 'R': winner = 1; break;
                    case 'P': winner = 0; break;
                    case 'S': winner = 2; break;
                }
                break;
                case 'S': switch(player2) {
                    case 'R': winner = 2; break;
                    case 'P': winner = 1; break;
                    case 'S': winner = 0; break;
                }
                break;
            }
            // positive value means you won, negative means the other player won
            socket1.emit('winner', (winner == 2 ? -1 : winner));
            socket2.emit('winner', (winner == 1 ? -1 : winner));
        }

    }
    if (playerQueue.getLength() >= 2) {
        socket1 = playerQueue.dequeue();
        socket2 = playerQueue.dequeue();
        socket1.emit('play');
        socket2.emit('play');
        socket1.on('played', (data) => handle(data, 1));
        socket2.on('played', (data) => handle(data, 2));
        
    }
}
io.on('connection', (socket) => {
    playerQueue.enqueue(socket);
    socket.on('replay', () => {
        playerQueue.enqueue(socket);
        console.log("Player replay");
        play();

    });
    play();
});
