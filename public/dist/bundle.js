/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Environment {

    constructor(state = ['', '', '', '', '', '', '', '', '']) {
        this.state = state;
    }

    isBoardEmpty() {
        return this.state.every(cell => !cell);
    }

    isBoardFull() {
        return this.state.every(cell => cell);
    }

    isTerminal() {
        //Return False if board in empty
        if (this.isBoardEmpty()) return false;

        //Checking Horizontal Wins
        if (this.state[0] == this.state[1] && this.state[0] == this.state[2] && this.state[0]) {
            return { 'winner': this.state[0], 'direction': 'H', 'row': 1 };
        }
        if (this.state[3] == this.state[4] && this.state[3] == this.state[5] && this.state[3]) {
            return { 'winner': this.state[3], 'direction': 'H', 'row': 2 };
        }
        if (this.state[6] == this.state[7] && this.state[6] == this.state[8] && this.state[6]) {
            return { 'winner': this.state[6], 'direction': 'H', 'row': 3 };
        }

        //Checking Vertical Wins
        if (this.state[0] == this.state[3] && this.state[0] == this.state[6] && this.state[0]) {
            return { 'winner': this.state[0], 'direction': 'V', 'row': 1 };
        }
        if (this.state[1] == this.state[4] && this.state[1] == this.state[7] && this.state[1]) {
            return { 'winner': this.state[1], 'direction': 'V', 'row': 2 };
        }
        if (this.state[2] == this.state[5] && this.state[2] == this.state[8] && this.state[2]) {
            return { 'winner': this.state[2], 'direction': 'V', 'row': 3 };
        }

        //Checking Diagonal Wins
        if (this.state[0] == this.state[4] && this.state[0] == this.state[8] && this.state[0]) {
            return { 'winner': this.state[0], 'direction': 'D', 'row': 1 };
        }
        if (this.state[2] == this.state[4] && this.state[2] == this.state[6] && this.state[2]) {
            return { 'winner': this.state[2], 'direction': 'D', 'row': 2 };
        }

        //If no winner but the board is full, then it's a draw
        if (this.isBoardFull()) {
            return { 'winner': 'draw' };
        }

        //return false otherwise
        return false;
    }

    performAction(action) {
        if (action.position > 8 || this.state[action.position]) return false; //Cell is either occupied or does not exist
        this.state[action.position] = action.symbol;
        return true;
    }

    getPercept() {
        const percept = { moves: [], isTerminal: false, winner: '', state: this.state };
        this.state.forEach((cell, index) => {
            if (!cell) percept.moves.push(index);
        });
        percept.isTerminal = this.isTerminal();
        if (percept.isTerminal) {
            percept.winner = percept.isTerminal.winner;
        }
        return percept;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Environment);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Environment__ = __webpack_require__(0);


class Agent {

	constructor(max_depth = -1, starting) {
		this.max_depth = max_depth;
		this.nodes_map = new Map();
		this.starting = starting;
	}

	lookAhead(percept_sequence, maximizing, depth) {
		//clear nodes_map if the function is called for a new move
		if (depth == 0) this.nodes_map.clear();
		//If the board state is a terminal one, return the heuristic value
		if (percept_sequence.isTerminal || depth == this.max_depth) {
			if (percept_sequence.winner == 'x') {
				return 100 - depth;
			} else if (percept_sequence.winner == 'o') {
				return -100 + depth;
			}
			return 0;
		}

		//Initialize best to the lowest possible value
		let best = maximizing ? -100 : 100;
		//Loop through all empty cells
		percept_sequence.moves.forEach(index => {
			//Initialize a new board with the current state (slice() is used to create a new array and not modify the original)
			let child = new __WEBPACK_IMPORTED_MODULE_0__Environment__["a" /* default */](percept_sequence.state.slice());
			//Create a child node by inserting the maximizing symbol into the current empty cell
			child.performAction({ position: index, symbol: maximizing ? 'x' : 'o' });

			//Recursively calling lookAhead this time with the new board and next turn and incrementing the depth
			let node_value = this.lookAhead(child.getPercept(), !maximizing, depth + 1);
			//Updating best value
			best = maximizing ? Math.max(best, node_value) : Math.min(best, node_value);

			//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies
			if (depth == 0) {
				//Comma seperated indicies if multiple moves have the same heuristic value
				var moves = this.nodes_map.has(node_value) ? `${this.nodes_map.get(node_value)},${index}` : index;
				this.nodes_map.set(node_value, moves);
			}
		});
		//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value
		if (depth == 0) {
			if (typeof this.nodes_map.get(best) == 'string') {
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

	sensor(Environment) {
		return Environment.getPercept();
	}

	agentFunction(percept_sequence) {
		let bestPosition = this.lookAhead(percept_sequence, this.starting, 0);
		return bestPosition;
	}

	actuator(Environment, bestPosition) {
		const action = { position: bestPosition, symbol: this.starting ? 'x' : 'o' };
		return Environment.performAction(action);
	}
	//If computer is going to start, choose a random cell as long as it is the center or a corner
	startingMove(Environment) {
		let center_and_corners = [0, 2, 4, 6, 8];
		let first_choice = center_and_corners[Math.floor(Math.random() * center_and_corners.length)];
		this.actuator(Environment, first_choice);
		return first_choice;
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Agent);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Canvas {

    //Helpers (from http://jaketrent.com/post/addremove-classes-raw-javascript/)
    hasClass(el, className) {
        if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }

    addClass(el, className) {
        if (el.classList) el.classList.add(className);else if (!this.hasClass(el, className)) el.className += " " + className;
    }

    removeClass(el, className) {
        if (el.classList) el.classList.remove(className);else if (this.hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Canvas);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_Agent__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_Environment__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_Canvas__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_scss__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__style_scss__);





const canvas = new __WEBPACK_IMPORTED_MODULE_2__classes_Canvas__["a" /* default */]();

function drawWinningLine({ direction, row }) {
	let board = document.getElementById("board");
	board.className = `${direction}${row}`;
	setTimeout(() => {
		board.className += ' full';
	}, 50);
}

//Starts a new game with a certain depth and a starting_player of 1 if human is going to start
function newGame(depth = -1, starting_player = 1, game_mode = 1) {
	//Instantiating a new player and an empty board
	let p = new __WEBPACK_IMPORTED_MODULE_0__classes_Agent__["a" /* default */](parseInt(depth), parseInt(starting_player) == 1 ? false : true);
	let b = new __WEBPACK_IMPORTED_MODULE_1__classes_Environment__["a" /* default */](['', '', '', '', '', '', '', '', '']);

	//Clearing all #Board classes and populating cells HTML
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
	let starting = parseInt(starting_player),
	    maximizing = starting,
	    player_turn = starting;

	//If computer is going to start, choose a random cell as long as it is the center or a corner
	if (!starting && game_mode == 1) {
		let first_choice = p.startingMove(b);
		canvas.addClass(html_cells[first_choice], 'x');
		player_turn = 1; //Switch turns
	} else if (game_mode == 0) {
		starting = 1;
		maximizing = 1;
		player_turn = 1;
	}

	//Adding Click event listener for each cell
	b.state.forEach((cell, index) => {
		html_cells[index].addEventListener('click', () => {
			//If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
			if (canvas.hasClass(html_cells[index], 'x') || canvas.hasClass(html_cells[index], 'o') || b.isTerminal() || !player_turn && game_mode == 1) return false;

			let symbol_human = 0,
			    symbol_agent = 0;
			if (game_mode == 1) {
				symbol_human = maximizing ? 'x' : 'o'; //Maximizing player is always 'x'
				symbol_agent = !maximizing ? 'x' : 'o';
			} else {
				symbol_human = player_turn ? 'x' : 'o';
			}
			//Update the Board class instance as well as the Board UI
			b.performAction({ position: index, symbol: symbol_human });
			canvas.addClass(html_cells[index], symbol_human);

			//If it's a terminal move and it's not a draw, then human won
			if (b.isTerminal()) {
				let { winner } = b.isTerminal();
				if (winner !== 'draw') {
					if (game_mode == 1) canvas.addClass(document.getElementById("characters"), 'celebrate_human');else {
						if (winner == 'o') canvas.addClass(document.getElementById("characters"), 'celebrate_human_2');else canvas.addClass(document.getElementById("characters"), 'celebrate_human');
					}
				}
				drawWinningLine(b.isTerminal());
				return true;
			}
			player_turn = 1 - player_turn; //Switch turns

			if (game_mode == 1) {
				//Agent's turn
				let percept_sequence = p.sensor(b);
				//console.log(percept_sequence);
				let nextBestPosition = p.agentFunction(percept_sequence);
				//console.log(nextBestPosition);
				p.actuator(b, nextBestPosition);
				canvas.addClass(html_cells[nextBestPosition], symbol_agent);

				if (b.isTerminal()) {
					let { winner } = b.isTerminal();
					if (winner !== 'draw') canvas.addClass(document.getElementById("characters"), 'celebrate_robot');
					drawWinningLine(b.isTerminal());
					return true;
				}

				player_turn = 1; //Switch turns
			}
		}, false);
		if (cell) canvas.addClass(html_cells[index], cell);
	});
}

document.addEventListener("DOMContentLoaded", event => {

	//Start a new game when page loads with default values
	let depth = -1;
	let starting_player = 1;
	let game_mode = 1;
	newGame(depth, starting_player, game_mode);

	//Events handlers for depth, starting player options
	document.getElementById("depth").addEventListener("click", event => {
		if (event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return;
		let depth_choices = [...document.getElementById("depth").children[0].children];
		depth_choices.forEach(choice => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		depth = event.target.dataset.value;
	}, false);

	document.getElementById("starting_player").addEventListener("click", event => {
		if (event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return;
		let starting_player_choices = [...document.getElementById("starting_player").children[0].children];
		starting_player_choices.forEach(choice => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		starting_player = event.target.dataset.value;
	}, false);

	document.getElementById("game_mode").addEventListener("click", event => {
		if (event.target.tagName !== "LI" || canvas.hasClass(event.target, 'active')) return;
		let game_mode_choices = [...document.getElementById("game_mode").children[0].children];
		game_mode_choices.forEach(choice => {
			canvas.removeClass(choice, 'active');
		});
		canvas.addClass(event.target, 'active');
		game_mode = event.target.dataset.value;
		if (game_mode == 0) {
			canvas.addClass(document.getElementById("vs_computer_field"), 'invisible');
			canvas.addClass(document.getElementById("characters"), 'invisible');
		} else {
			canvas.removeClass(document.getElementById("vs_computer_field"), 'invisible');
			canvas.removeClass(document.getElementById("characters"), 'invisible');
		}
	}, false);

	document.getElementById("newgame").addEventListener('click', () => {
		newGame(depth, starting_player, game_mode);
	});
});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map