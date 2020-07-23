const Environment = require('./Environment-module');
const random = require('random');
const fs = require('fs');

/**
 * @desc a simplified version of Agent.js for training in Q-Learning Environment
 * @param {String} name name of the agent
 * @param {Number} exp_rate exploration rate of the agent, default is 30%
 */
class QLearningAgent {
    constructor(name, exp_rate = 0.3) {
        this.name = name;
        this.states = [];// record of all states encountered
        this.lr = 0.2;// learning rate
        this.exp_rate = exp_rate;
        this.decay_gamma = 0.9;//discount factor
        this.state_value = new Map(); // map to store state and corresponding q-value
    }

    /**
     * @desc Converts array to a string to be used as a key for state_value map
     * @param {Array} board array representing the cells of the board
     * @return {String} returns string value of board array
     */
    getHash(board) {
        return board.toString();
    }

    /**
     * @desc method chooses the best action(position) to take depending on the QTable (state_value map) present
     * @param {Array} positions array of possible moves 
     * @param {Array} current_board array representing current board state 
     * @param {String} symbol symbol to be inserted in the board 
     * @return {Number} best action to take
     */
    chooseAction(positions, current_board, symbol) {
        let action = -1;
        //Random chance of "exploring" ,i.e performing a random move rather than following the q-table
        if (random.float() <= this.exp_rate) {
            let idx = random.int(0, positions.length - 1);
            action = positions[idx];
            //console.log("RANDOM:" + action);
        }
        else {
            //following the q-table
            let value_max = -999;
            //iterating over every available position
            positions.forEach((cell, index) => {
                //Initialize a new board state with the current state (slice() is used to create a new array and not modify the original)
                let next_board = current_board.slice();
                //insert the agent symbol
                next_board[cell] = symbol;
                //generate a string form of current state
                let next_boardHash = this.getHash(next_board);
                //check if new state is present in the Q-table else assign 0 to value
                let value = (this.state_value.get(next_boardHash) !== undefined)? this.state_value.get(next_boardHash) : 0;
                if (value > value_max) {
                    value_max = value;
                    action = cell;
                }
            });
            //console.log("SELECTED:" + action);
        }
        //return the best action(position to take)
        return action;
    }

    /**
     * @desc Using the Bellman equation to update the current q-value for the current state and hence putting it in the state_value map
     * @param {Number} reward reward value for current state received from the "judge" (QLearningEnvironment)
     */
    feedReward(reward) {
        this.states.slice().reverse().forEach((cell, index) =>{
            if (!this.state_value.get(cell)) {
                this.state_value.set(cell, 0);
            }
            let current_value = this.state_value.get(cell);
            //updating current value
            let updated_value = current_value + this.lr * (this.decay_gamma * reward - current_value);
            this.state_value.set(cell, updated_value);
            reward = this.state_value.get(cell);
        });
    }

    /**
     * @desc method adds state to states array
     * @param {String} board_hash string value of board state 
     */
    addState(board_hash) {
        this.states.push(board_hash);
    }

    /**
     * @desc method to reset the agent
     */
    reset() {
        this.states = [];
    }
}

/**
 * @desc QLearningEnvironment 'has a' (composition) Environment object as well as "judge" methods to evaluate the agents
 * @param {Object} player1 object of QLearningAgent 
 * @param {Object} player2 object of QLearningAgent
 */
class QLearningEnvironment {
    constructor(player1, player2) {
        this.board = new Environment(['','','','','','','','','']);
        this.player1 = player1;
        this.player2 = player2;
        this.isEnd = false; //determines if game has ended
        this.playerSymbol = 'x';
    }

    /**
     * @desc method to reset the game environment
     */
    reset() {
        this.playerSymbol = 'x';
        this.isEnd = false;
        this.board.state = ['','','','','','','','',''];
    }

    /**
     * @desc method to return string value of current board state
     */
    getHash() {
        return this.board.state.toString();
    }

    /**
     * @desc method to return available positions to make a move
     */
    availablePositions() {
        return this.board.getPercept().moves;
    }

    /**
     * @desc method to update the board
     * @param {Number} position to put symbol in 
     */
    updateState(position) {
        this.board.performAction({position: position, symbol: this.playerSymbol});

        this.playerSymbol = this.playerSymbol === 'x' ? 'o' : 'x';
    }

    /**
     * @desc method which returns the winner of the round if game is over else returns null
     */
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

    /**
     * @desc method which passes on "reward" to the agents
     */
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
            this.player1.feedReward(0.1);//considering that a draw is not desirable
            this.player2.feedReward(0.5);
        }
    }

    /**
     * @desc method to make the agents play against themselves
     * @param {Number} rounds number of games the agents should play, default 5,00,000
     */
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
                    //Player 2
                    positions = this.availablePositions();
                    let p2_action = this.player2.chooseAction(positions, this.board.state, this.playerSymbol);
                    //take actions and update board state
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
qlearner.play();//initiating training of agents

const obj_x = Object.fromEntries(p1.state_value);
const policy_x = JSON.stringify(obj_x);
fs.writeFileSync('./policy_x', policy_x);//saving state_value map (q-table) for agent 'x'

const obj_o = Object.fromEntries(p2.state_value);
const policy_o = JSON.stringify(obj_o);
fs.writeFileSync('./policy_o', policy_o);//saving state_value map (q-table) for agent 'o'

/**
 * @note run using `node QLearner.js` in console
 * save generated policy_x and policy_o in ../classes/QLearning_Policy_x.js and ../classes/QLearning_Policy_o.js respectively 
 */
