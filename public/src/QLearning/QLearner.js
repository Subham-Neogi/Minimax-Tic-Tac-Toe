const Environment = require('./Environment-module');
const random = require('random');
const fs = require('fs');

class QLearningAgent {
    constructor(name, exp_rate = 0.3) {
        this.name = name;
        this.states = [];
        this.lr = 0.2;
        this.exp_rate = exp_rate;
        this.decay_gamma = 0.9;
        this.state_value = new Map(); 
    }

    getHash(board) {
        return board.toString();
    }

    chooseAction(positions, current_board, symbol) {
        let action = -1;
        if (random.float() <= this.exp_rate) {
            let idx = random.int(0, positions.length - 1);
            action = positions[idx];
            //console.log("RANDOM:" + action);
        }
        else {
            let value_max = -999;
            positions.forEach((cell, index) => {
                let next_board = current_board.slice();
                next_board[cell] = symbol;
                let next_boardHash = this.getHash(next_board);
                let value = (this.state_value.get(next_boardHash) !== undefined)? this.state_value.get(next_boardHash) : 0;
                if (value > value_max) {
                    value_max = value;
                    action = cell;
                }
            });
            //console.log("SELECTED:" + action);
        }
        return action;
    }

    feedReward(reward) {
        this.states.slice().reverse().forEach((cell, index) =>{
            if (!this.state_value.get(cell)) {
                this.state_value.set(cell, 0);
            }
            let current_value = this.state_value.get(cell);
            let updated_value = current_value + this.lr * (this.decay_gamma * reward - current_value);
            this.state_value.set(cell, updated_value);
            reward = this.state_value.get(cell);
        });
    }

    addState(board_hash) {
        this.states.push(board_hash);
    }

    reset() {
        this.states = [];
    }
}

class QLearningEnvironment {
    constructor(player1, player2) {
        this.board = new Environment(['','','','','','','','','']);
        this.player1 = player1;
        this.player2 = player2;
        this.isEnd = false;
        this.playerSymbol = 'x';
    }

    reset() {
        this.playerSymbol = 'x';
        this.isEnd = false;
        this.board.state = ['','','','','','','','',''];
    }

    getHash() {
        return this.board.state.toString();
    }

    availablePositions() {
        return this.board.getPercept().moves;
    }

    updateState(position) {
        this.board.performAction({position: position, symbol: this.playerSymbol});

        this.playerSymbol = this.playerSymbol === 'x' ? 'o' : 'x';
    }

    winner() {
        let winner = this.board.getPercept().winner;
        if (winner !== '') {
            this.isEnd = true;
            return winner;
        }
        else {
            return null;
        }
    }

    giveReward() {
        let result = this.winner();

        if (result === 'x') {
            this.player1.feedReward(1);
            this.player2.feedReward(0);
        }
        else if (result === 'o') {
            this.player2.feedReward(1);
            this.player1.feedReward(0);
        }
        else {
            this.player1.feedReward(0.1);
            this.player2.feedReward(0.5);
        }
    }

    play(rounds = 500000) {
        for (let i = 1; i <= rounds; i++) {
            
            
            console.log(`Round  ${i}`);

            while(!this.isEnd) {
                //Player 1 
                let positions = this.availablePositions();
                let p1_action = this.player1.chooseAction(positions, this.board.state, this.playerSymbol);
                //take action and update board state
                this.updateState(p1_action);
                let board_hash = this.getHash();
                this.player1.addState(board_hash);

                let win = this.winner();
                if (win) {
                    this.giveReward();
                    this.player1.reset();
                    this.player2.reset();
                    this.reset();
                    console.log(this.player1.name);
                    break;
                }
                else {
                    positions = this.availablePositions();
                    let p2_action = this.player2.chooseAction(positions, this.board.state, this.playerSymbol);
                    this.updateState(p2_action);
                    board_hash = this.getHash();
                    this.player2.addState(board_hash);

                    win = this.winner();
                    if (win) {
                        this.giveReward();
                        this.player2.reset();
                        this.player1.reset();
                        this.reset();
                        console.log(this.player2.name);
                        break;
                    }
                }
            }
        }
    }
}

let p1 = new QLearningAgent('x');
let p2 = new QLearningAgent('o');
let qlearner = new QLearningEnvironment(p1,p2);
qlearner.play();

const obj_x = Object.fromEntries(p1.state_value);
const policy_x = JSON.stringify(obj_x);
fs.writeFileSync('./policy_x', policy_x);

const obj_o = Object.fromEntries(p2.state_value);
const policy_o = JSON.stringify(obj_o);
fs.writeFileSync('./policy_o', policy_o);
