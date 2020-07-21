import Environment from './Environment';
import policy_x from './QLearning_Policy_x';
import policy_o from './Qlearning_Policy_o';

class Agent {
	
	constructor(starting, max_depth = -1, use_minimax=true) {
        this.max_depth = max_depth;
		this.nodes_map = new Map();
		this.starting = starting;
		this.use_minimax = use_minimax;
    }

	minimaxLookAhead(percept_sequence, maximizing, depth) {
		//clear nodes_map if the function is called for a new move
		if(depth == 0) this.nodes_map.clear();
		//If the board state is a terminal one, return the heuristic value
		if(percept_sequence.isTerminal || depth == this.max_depth ) {
			if(percept_sequence.winner == 'x') {
				return 100 - depth;
			} else if (percept_sequence.winner == 'o') {
				return -100 + depth;
			} 
			return 0;
		}

		//Initialize best to the lowest possible value
		let best = maximizing? -100: 100;
		//Loop through all empty cells
		percept_sequence.moves.forEach(index => {
			//Initialize a new board with the current state (slice() is used to create a new array and not modify the original)
			let child = new Environment(percept_sequence.state.slice());
			//Create a child node by inserting the maximizing symbol into the current empty cell
			child.performAction({position: index, symbol: maximizing? 'x' : 'o'});

			//Recursively calling minimaxLookAhead this time with the new board and next turn and incrementing the depth
			let node_value = this.minimaxLookAhead(child.getPercept(), !maximizing, depth + 1);
			//Updating best value
			best = maximizing? Math.max(best, node_value): Math.min(best, node_value);
			
			//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies
			if(depth == 0) {
				//Comma seperated indicies if multiple moves have the same heuristic value
				var moves = this.nodes_map.has(node_value) ? `${this.nodes_map.get(node_value)},${index}` : index;
				this.nodes_map.set(node_value, moves);
			}
		});
		//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value
		if(depth == 0) {
			if(typeof this.nodes_map.get(best) == 'string') {
				var arr = this.nodes_map.get(best).split(',');
				var rand = Math.floor(Math.random() * arr.length);
				var ret = arr[rand];
			} else {
				ret = this.nodes_map.get(best);
			}
			//run a callback after calculation and return the index
			return ret;
		}
		//If not main call (recursive) return the heuristic value for next calculation
		return best;
	}

	qtableLookAhead(percept_sequence, starting) {
		let value_max = -999;
		let symbol = 'x';
		let policy = policy_x;
		let bestAction = -1;
		if (!starting) {
			symbol ='o';
			policy = policy_o;
		}
		percept_sequence.moves.forEach((cell, index) => {
			let next_state = percept_sequence.state.slice();
			next_state[cell] = symbol;
			let next_stateHash = next_state.toString();
			let value = (policy[next_stateHash] !== undefined)? policy[next_stateHash] : 0;
                if (value > value_max) {
                    value_max = value;
                    bestAction = cell;
                }
		});
		return bestAction;
	}

	sensor(Environment) {
		return Environment.getPercept();
	}

	agentFunction(percept_sequence) {
		let bestPosition = 0;
		if (this.use_minimax) {
			bestPosition = this.minimaxLookAhead(percept_sequence, this.starting, 0);
		}
		else {
			bestPosition = this.qtableLookAhead(percept_sequence, this.starting);
		}
		return bestPosition;
	}

	actuator(Environment, bestPosition) {
		const action = {position: bestPosition, symbol: this.starting? 'x' : 'o'};
		return Environment.performAction(action);
	}
	//If computer is going to start, choose a random cell as long as it is the center or a corner
	startingMove(Environment) {
		let center_and_corners = [0,2,4,6,8];
        let first_choice = center_and_corners[Math.floor(Math.random()*center_and_corners.length)];
		this.actuator(Environment, first_choice);
		return first_choice;
	}
}

export default Agent;