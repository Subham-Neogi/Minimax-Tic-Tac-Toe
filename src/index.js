import Agent from './classes/Agent';
import Environment from './classes/Environment';
import Canvas from './classes/Canvas';
import './style.scss';


const canvas = new Canvas();

function drawWinningLine({ direction, row }) {
	let board = document.getElementById("board");
	board.className = `${direction}${row}`;
	setTimeout(() => { board.className += ' full'; }, 50);
}


//Starts a new game with a certain depth and a starting_player of 1 if human is going to start
function newGame(depth = -1, starting_player = 1) {
	//Instantiating a new player and an empty board
	let p = new Agent(parseInt(depth), parseInt(starting_player)==1? false: true);
	let b = new Environment(['','','','','','','','','']);

	//Clearing all #Board classes and populating cells HTML
	let board = document.getElementById("board");
	board.className = '';
	board.innerHTML = '<div class="cell-0"></div><div class="cell-1"></div><div class="cell-2"></div><div class="cell-3"></div><div class="cell-4"></div><div class="cell-5"></div><div class="cell-6"></div><div class="cell-7"></div><div class="cell-8"></div>';
	
	//Clearing all celebrations classes
	canvas.removeClass(document.getElementById("characters"), 'celebrate_human');
	canvas.removeClass(document.getElementById("characters"), 'celebrate_robot');

	//Storing HTML cells in an array
	let html_cells = [...board.children];

	//Initializing some variables for internal use
	let starting = parseInt(starting_player),
		maximizing = starting,
		player_turn = starting;

	//If computer is going to start, choose a random cell as long as it is the center or a corner
	if(!starting) {
		let first_choice = p.startingMove(b);
		canvas.addClass(html_cells[first_choice], 'x');
		player_turn = 1; //Switch turns
	}

	//Adding Click event listener for each cell
  	b.state.forEach((cell, index) => {
  		html_cells[index].addEventListener('click', () => {
  			//If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
  			if(canvas.hasClass(html_cells[index], 'x') || canvas.hasClass(html_cells[index], 'o') || b.isTerminal() || !player_turn) return false;

  			let symbol_human = maximizing ? 'x' : 'o'; //Maximizing player is always 'x'
			let symbol_agent = !maximizing ? 'x' : 'o';
  			//Update the Board class instance as well as the Board UI
  			b.performAction({position: index, symbol: symbol_human});
  			canvas.addClass(html_cells[index], symbol_human);

  			//If it's a terminal move and it's not a draw, then human won
  			if(b.isTerminal()) {
  				let { winner } = b.isTerminal();
				if(winner !== 'draw') canvas.addClass(document.getElementById("characters"), 'celebrate_human');
				  drawWinningLine(b.isTerminal());
				  return true;
  			}
			player_turn = 0; //Switch turns
			  
			//Agent's turn
			let percept = p.sensor(b);
			//console.log(percept);
			let best = p.agentFunction(percept);
			//console.log(best);
			p.actuator(b, best);
			canvas.addClass(html_cells[best], symbol_agent);
			if(b.isTerminal()) {
				let { winner } = b.isTerminal();
				if(winner !== 'draw') canvas.addClass(document.getElementById("characters"), 'celebrate_robot');
				drawWinningLine(b.isTerminal());
				return true;
			}

			player_turn = 1; //Switch turns
  		}, false);
  		if(cell) canvas.addClass(html_cells[index], cell);
  	});
}

document.addEventListener("DOMContentLoaded", event => { 

	//Start a new game when page loads with default values
	let depth = -1;
	let starting_player = 1;
	newGame(depth, starting_player);


	//Events handlers for depth, starting player options
	document.getElementById("depth").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return
		let depth_choices = [...document.getElementById("depth").children[0].children];
		depth_choices.forEach((choice) => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		depth = event.target.dataset.value;
	}, false);

	document.getElementById("starting_player").addEventListener("click", (event) => {
		if(event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return
		let starting_player_choices = [...document.getElementById("starting_player").children[0].children];
		starting_player_choices.forEach((choice) => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		starting_player = event.target.dataset.value;
	}, false);

	document.getElementById("newgame").addEventListener('click', () => {
		newGame(depth, starting_player);
	});

});