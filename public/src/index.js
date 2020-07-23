/**
 * @note run `npx webpack` in console to bundle all the classes to create `bundle.js` for deployment
 */

 /**
  * @desc `index.js` acts as a bridge between all the classes and HTML DOM
  */
import Agent from './classes/Agent';
import Environment from './classes/Environment';
import Canvas from './classes/Canvas';
import './style.scss';

//initializing hint variables
let hint_for = 'x', hint_position = -1;
const canvas = new Canvas();

//function to draw winning line on the HTML canvas
function drawWinningLine({ direction, row }) {
	let board = document.getElementById("board");
	board.className = `${direction}${row}`;
	setTimeout(() => { board.className += ' full'; }, 50);
}

//Starts a new game with a certain depth, a starting_player of 1 if human is going to start, game mode 1 if it is human vs computer
// and algo 1 if minimax algorithm is to be used
function newGame(depth = -1, starting_player = 1, game_mode = 1, algo = 1) {
	//Instantiating a new agent and an empty board environment
	let agent = new Agent(starting_player==1? false: true, depth, algo==1? true: false);
	let environment = new Environment(['','','','','','','','','']);

	//Clearing all #board classes and populating cells HTML
	let board = document.getElementById("board");
	board.className = '';
	board.innerHTML = '<div class="cell-0"></div><div class="cell-1"></div><div class="cell-2"></div><div class="cell-3"></div><div class="cell-4"></div><div class="cell-5"></div><div class="cell-6"></div><div class="cell-7"></div><div class="cell-8"></div>';
	
	//Clearing all celebrations classes
	canvas.removeClass(document.getElementById("characters"), 'celebrate_human');
	canvas.removeClass(document.getElementById("characters"), 'celebrate_robot');
	canvas.removeClass(document.getElementById("characters"), 'celebrate_human_2');

	//Storing HTML cells in an array
	let html_cells = [...board.children];

	//Initializing some variables for internal use
	let starting = starting_player,
		maximizing = starting,
		player_turn = starting;

	//If computer is going to start, choose a random cell as long as it is the center or a corner
	if(!starting && game_mode == 1) {
		let first_choice = agent.startingMove(environment);
		canvas.addClass(html_cells[first_choice], 'x');
		player_turn = 1; //Switch turns
	}
	else if (game_mode == 0) {
		//if it is human v human game mode
		maximizing = 1;
		player_turn = 1;
	}

	//Adding Click event listener for each cell
  	environment.state.forEach((cell, index) => {
  		html_cells[index].addEventListener('click', () => {
			if (hint_position != -1) canvas.removeClass(html_cells[hint_position], hint_for+'_hint');
  			//If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
  			if(canvas.hasClass(html_cells[index], 'x') || canvas.hasClass(html_cells[index], 'o') || environment.isTerminal() || (!player_turn && game_mode == 1)) return false;

			let symbol_human = 'x', symbol_agent = 'o';
			if (game_mode == 1)
			{
				symbol_human = maximizing ? 'x' : 'o'; //Maximizing player is always 'x'
				hint_for = symbol_human;
				symbol_agent = !maximizing ? 'x' : 'o';
			}  
			else
			{
				symbol_human = player_turn ? 'x' : 'o';
				hint_for = !player_turn ? 'x' : 'o';
			}
			/**
			 * @info Human player's move
			 */
  			//Update the board class instance as well as the board UI
  			environment.performAction({position: index, symbol: symbol_human});
  			canvas.addClass(html_cells[index], symbol_human);

  			//If it's a terminal move and it's not a draw, then human won
  			if(environment.isTerminal()) {
  				let { winner } = environment.isTerminal();
				if(winner !== 'draw') {
					if (game_mode == 1) canvas.addClass(document.getElementById("characters"), 'celebrate_human');
					else {
						if (winner == 'o') canvas.addClass(document.getElementById("characters"), 'celebrate_human_2');
						else canvas.addClass(document.getElementById("characters"), 'celebrate_human');
					}
				}
				  drawWinningLine(environment.isTerminal());
				  return true;
  			}
			player_turn = 1 - player_turn; //Switch turns
			  
			if (game_mode == 1) {
				/**
				 * @info Agent player's move
				 * Calling the Agent's sensor, agent function and actuators in sequence to get the work done
				 */

				 //Calling the Agent's sensor to get percepts
				let percept_sequence = agent.sensor(environment);
				//console.log(percept_sequence);

				//Using agent function to get next best move
				let nextbestPosition = agent.agentFunction(percept_sequence);
				//console.log(nextbestPosition);

				//Using actuators to perform an action and updating the board UI
				agent.actuator(environment, nextbestPosition);
				canvas.addClass(html_cells[nextbestPosition], symbol_agent);

				//Checking if the agent won
				if(environment.isTerminal()) {
					let { winner } = environment.isTerminal();
					if(winner !== 'draw') canvas.addClass(document.getElementById("characters"), 'celebrate_robot');
					drawWinningLine(environment.isTerminal());
					return true;
				}

				player_turn = 1; //Switch turns
			}
  		}, false);
  		if(cell) canvas.addClass(html_cells[index], cell);
  	});
}

//function to implement the `Hints` system
function getHint() {
	let board = document.getElementById("board");
	//using a new agent to get hints, using minimax algorithm
	let agent = new Agent(hint_for == 'x'? true : false, -1, true);
	let current_state = [];

	let html_cells = [...board.children];
	let flag = true;

	//iterating over each cell
	html_cells.forEach((cell, index) => {
		if(canvas.hasClass(html_cells[index], 'x_hint') || canvas.hasClass(html_cells[index], 'o_hint')) {
			flag = false;
		}

		if (canvas.hasClass(html_cells[index], 'x')) {
			current_state[index] = 'x';
		}
		else if (canvas.hasClass(html_cells[index], 'o')) {
			current_state[index] = 'o';
		}
		else {
			current_state[index] = '';
		}
	});

	//creating a copy of the current environment
	let environment = new Environment(current_state);
	
	if (environment.isTerminal() || !flag) {
		return false;
	}

	//Using sensor to get percept
	let percept_sequence = agent.sensor(environment);
	//console.log(percept_sequence);

	//using agent function to get next best move
	let nextbestPosition = agent.agentFunction(percept_sequence);
	//console.log(nextbestPosition);

	//updating the board UI and giving hint to the player
	canvas.addClass(html_cells[nextbestPosition], hint_for+'_hint');
	hint_position = nextbestPosition;

	return true;
}

//Adding click event listener's for all the UI buttons
document.addEventListener("DOMContentLoaded", event => { 

	//Start a new game when page loads with default values
	let depth = -1;
	let starting_player = 1;
	let game_mode = 1;
	let algo = 1;
	newGame(depth, starting_player, game_mode, algo);


	//Events handler for algo
	document.getElementById("algo").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return
		let algo_choices = [...document.getElementById("algo").children[0].children];
		algo_choices.forEach((choice) => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		algo = event.target.dataset.value;
		algo = parseInt(algo);
		if (algo == 0) {
			canvas.addClass(document.getElementById("depth_wrap"), 'hide');
			canvas.removeClass(document.getElementById("q_learn_text"), 'hide');
		}
		else {
			canvas.removeClass(document.getElementById("depth_wrap"), 'hide');
			canvas.addClass(document.getElementById("q_learn_text"), 'hide');
		}
	}, false);

	//Events handler for depth
	document.getElementById("depth").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return
		let depth_choices = [...document.getElementById("depth").children[0].children];
		depth_choices.forEach((choice) => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		depth = event.target.dataset.value;
		depth = parseInt(depth);
	}, false);

	//Events handler for starting player
	document.getElementById("starting_player").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return
		let starting_player_choices = [...document.getElementById("starting_player").children[0].children];
		starting_player_choices.forEach((choice) => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		starting_player = event.target.dataset.value;
		starting_player = parseInt(starting_player);
	}, false);

	//Events handler for game mode
	document.getElementById("game_mode").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return
		let game_mode_choices = [...document.getElementById("game_mode").children[0].children];
		game_mode_choices.forEach((choice) => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		game_mode = event.target.dataset.value;
		game_mode = parseInt(game_mode);
		if (game_mode == 0) {
			canvas.addClass(document.getElementById("vs_computer_field"), 'invisible');
			canvas.addClass(document.getElementById("characters"), 'invisible');
		}
		else {
			canvas.removeClass(document.getElementById("vs_computer_field"), 'invisible');
			canvas.removeClass(document.getElementById("characters"), 'invisible');
		}
	}, false);

	//Events handler for hint 
	document.getElementById("hint").addEventListener('click', () => {
		getHint();
	})

	//Events handler for newgame
	document.getElementById("newgame").addEventListener('click', () => {
		hint_for = (!game_mode || starting_player)? 'x' : 'o';
		hint_position = -1;
		newGame(depth, starting_player, game_mode, algo);
	});

});