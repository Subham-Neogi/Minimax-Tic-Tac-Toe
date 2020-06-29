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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
  * @desc This class represents the board, contains methods that checks board state, insert a symbol, etc..
  * @param {Array} state - an array representing the state of the board
*/
class Board {
    //Initializing the board
    constructor(state = ['', '', '', '', '', '', '', '', '']) {
        this.state = state;
    }
    //Logs a visualised board with the current state to the console
    printFormattedBoard() {
        let formattedString = '';
        this.state.forEach((cell, index) => {
            formattedString += cell ? ` ${cell} |` : '   |';
            if ((index + 1) % 3 == 0) {
                formattedString = formattedString.slice(0, -1);
                if (index < 8) formattedString += '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
            }
        });
        console.log('%c' + formattedString, 'color: #6d4e42;font-size:16px');
    }
    //Checks if board has no symbols yet
    isEmpty() {
        return this.state.every(cell => !cell);
    }
    //Check if board has no spaces available
    isFull() {
        return this.state.every(cell => cell);
    }
    /**
     * Inserts a new symbol(x,o) into
     * @param {String} symbol 
     * @param {Number} position
     * @return {Boolean} boolean represent success of the operation
     */
    insert(symbol, position) {
        if (position > 8 || this.state[position]) return false; //Cell is either occupied or does not exist
        this.state[position] = symbol;
        return true;
    }
    //Returns an array containing available moves for the current state
    getAvailableMoves() {
        const moves = [];
        this.state.forEach((cell, index) => {
            if (!cell) moves.push(index);
        });
        return moves;
    }
    /**
     * Checks if the board has a terminal state ie. a player wins or the board is full with no winner
     * @return {Object} an object containing the winner, direction of winning and row number
     */
    isTerminal() {
        //Return False if board in empty
        if (this.isEmpty()) return false;

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
        if (this.isFull()) {
            return { 'winner': 'draw' };
        }

        //return false otherwise
        return false;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Board);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Board__ = __webpack_require__(0);


/**
  * @desc This class represents the computer player, contains a single method that uses minimax to get the best move
  * @param {Number} max_depth - limits the depth of searching
  * @param {Map} nodes_map - stores the heuristic values for each possible move
*/
class Player {
	constructor(max_depth = -1) {
		this.max_depth = max_depth;
		this.nodes_map = new Map();
	}
	/**
  * Uses minimax algorithm to get the best move
  * @param {Object} board - an instant of the board class
  * @param {Boolean} maximizing - whether the player is a maximizing or a minimizing player
  * @param {Function} callback - a function to run after the best move calculation is done
  * @param {Number} depth - used internally in the function to increment the depth each recursive call
  * @return {Number} the index of the best move
  */
	getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
		//Throw an error if the first argument is not a board
		if (board.constructor.name !== "Board") throw 'The first argument to the getBestMove method should be an instance of Board class.';
		//Decides whether to log each tree iteration to the console
		const TRACE = window.trace_ttt;
		//clear nodes_map if the function is called for a new move
		if (depth == 0) this.nodes_map.clear();

		//If the board state is a terminal one, return the heuristic value
		if (board.isTerminal() || depth == this.max_depth) {
			if (board.isTerminal().winner == 'x') {
				return 100 - depth;
			} else if (board.isTerminal().winner == 'o') {
				return -100 + depth;
			}
			return 0;
		}

		//Defining some styles for console logging
		const console_styles = {
			turn_and_available_moves: 'background: #7f3192; color: #fff; font-size:14px;padding: 0 5px;',
			exploring_parent: 'background: #353535;color: #fff;padding: 0 5px;font-size:18px',
			exploring_child: 'background: #f03;color: #fff;padding: 0 5px',
			parent_heuristic: 'background: #26d47c; color: #fff; font-size:14px;padding: 0 5px;',
			child_heuristic: 'background: #5f9ead; color: #fff; font-size:14px;padding: 0 5px;',
			all_moves: 'background: #e27a50;color: #fff;padding: 0 5px;font-size:14px',
			best_move: 'background: #e8602a;color: #fff;padding: 0 5px;font-size:18px'
		};
		//Destructuring Styles
		const { turn_and_available_moves, exploring_parent, exploring_child, child_heuristic, parent_heuristic, all_moves, best_move } = console_styles;

		//Console Tracing Code
		if (TRACE) {
			let p = maximizing ? 'Maximizing' : 'Minimizing';
			console.log(`%c${p} player's turn Depth: ${depth}`, turn_and_available_moves);
			console.log(`%cAvailable Moves: ${board.getAvailableMoves().join(' ')}`, turn_and_available_moves);
			if (depth == 0) board.printFormattedBoard();
		}

		//Current player is maximizing
		if (maximizing) {
			//Initializ best to the lowest possible value
			let best = -100;
			//Loop through all empty cells
			board.getAvailableMoves().forEach(index => {
				//Initialize a new board with the current state (slice() is used to create a new array and not modify the original)
				let child = new __WEBPACK_IMPORTED_MODULE_0__Board__["a" /* default */](board.state.slice());
				//Create a child node by inserting the maximizing symbol x into the current emoty cell
				child.insert('x', index);

				//Console Tracing Code
				if (TRACE) {
					let styles = depth == 0 ? exploring_parent : exploring_child;
					console.log(`%cExploring move ${index}`, styles);
					child.printFormattedBoard();
				}

				//Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth
				let node_value = this.getBestMove(child, false, callback, depth + 1);
				//Updating best value
				best = Math.max(best, node_value);

				//Console Tracing Code
				if (TRACE) {
					if (depth == 0) {
						console.log(`%cMove ${index} yielded a heuristic value of ${node_value}`, parent_heuristic);
					} else {
						console.log(`%cChild move ${index} yielded a heuristic value of ${node_value}`, child_heuristic);
					}
				}

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
				//Console Tracing Code
				if (TRACE) {
					this.nodes_map.forEach((index, value) => {
						console.log(`%cMove(s) ${index} yielded ${value}`, all_moves);
					});
					console.log(`%cMove ${ret} was decided as the best move`, best_move);
				}
				//run a callback after calculation and return the index
				callback(ret);
				return ret;
			}
			//If not main call (recursive) return the heuristic value for next calculation
			return best;
		}

		if (!maximizing) {
			//Initializ best to the highest possible value
			let best = 100;
			//Loop through all empty cells
			board.getAvailableMoves().forEach(index => {
				//Initialize a new board with the current state (slice() is used to create a new array and not modify the original)
				let child = new __WEBPACK_IMPORTED_MODULE_0__Board__["a" /* default */](board.state.slice());
				//Create a child node by inserting the minimizing symbol o into the current emoty cell
				child.insert('o', index);

				//Console Tracing Code
				if (TRACE) {
					let styles = depth == 0 ? exploring_parent : exploring_child;
					console.log(`%cExploring move ${index}`, styles);
					child.printFormattedBoard();
				}

				//Recursively calling getBestMove this time with the new board and maximizing turn and incrementing the depth
				let node_value = this.getBestMove(child, true, callback, depth + 1);
				//Updating best value
				best = Math.min(best, node_value);

				//Console Tracing Code
				if (TRACE) {
					if (depth == 0) {
						console.log(`%cMove ${index} yielded a heuristic value of ${node_value}`, parent_heuristic);
					} else {
						console.log(`%cChild move ${index} yielded a heuristic value of ${node_value}`, child_heuristic);
					}
				}

				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies
				if (depth == 0) {
					//Comma seperated indicies if multiple moves have the same heuristic value
					var moves = this.nodes_map.has(node_value) ? this.nodes_map.get(node_value) + ',' + index : index;
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
				//Console Tracing Code
				if (TRACE) {
					this.nodes_map.forEach((index, value) => {
						console.log(`%cMove(s) ${index} yielded ${value}`, all_moves);
					});
					console.log(`%cMove ${ret} was decided as the best move`, best_move);
				}
				//run a callback after calculation and return the index
				callback(ret);
				return ret;
			}
			//If not main call (recursive) return the heuristic value for next calculation
			return best;
		}
	}
}

/* harmony default export */ __webpack_exports__["a"] = (Player);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_Board__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_Player__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_scss__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__style_scss__);




//Helpers (from http://jaketrent.com/post/addremove-classes-raw-javascript/)
function hasClass(el, className) {
	if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
function addClass(el, className) {
	if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
}
function removeClass(el, className) {
	if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		el.className = el.className.replace(reg, ' ');
	}
}

/*
Helper function that takes the object returned from isTerminal() and adds a 
class to the board that will handle drawing the winning line's animation
*/
function drawWinningLine({ direction, row }) {
	let board = document.getElementById("board");
	board.className = `${direction}${row}`;
	setTimeout(() => {
		board.className += ' full';
	}, 50);
}

//Starts a new game with a certain depth and a starting_player of 1 if human is going to start
function newGame(depth = -1, starting_player = 1) {
	//Instantiating a new player and an empty board
	let p = new __WEBPACK_IMPORTED_MODULE_1__classes_Player__["a" /* default */](parseInt(depth));
	let b = new __WEBPACK_IMPORTED_MODULE_0__classes_Board__["a" /* default */](['', '', '', '', '', '', '', '', '']);

	//Clearing all #Board classes and populating cells HTML
	let board = document.getElementById("board");
	board.className = '';
	board.innerHTML = '<div class="cell-0"></div><div class="cell-1"></div><div class="cell-2"></div><div class="cell-3"></div><div class="cell-4"></div><div class="cell-5"></div><div class="cell-6"></div><div class="cell-7"></div><div class="cell-8"></div>';

	//Clearing all celebrations classes
	removeClass(document.getElementById("charachters"), 'celebrate_human');
	removeClass(document.getElementById("charachters"), 'celebrate_robot');

	//Storing HTML cells in an array
	let html_cells = [...board.children];

	//Initializing some variables for internal use
	let starting = parseInt(starting_player),
	    maximizing = starting,
	    player_turn = starting;

	//If computer is going to start, choose a random cell as long as it is the center or a corner
	if (!starting) {
		let center_and_corners = [0, 2, 4, 6, 8];
		let first_choice = center_and_corners[Math.floor(Math.random() * center_and_corners.length)];
		let symbol = !maximizing ? 'x' : 'o';
		b.insert(symbol, first_choice);
		addClass(html_cells[first_choice], symbol);
		player_turn = 1; //Switch turns
	}

	//Adding Click event listener for each cell
	b.state.forEach((cell, index) => {
		html_cells[index].addEventListener('click', () => {
			//If cell is already occupied or the board is in a terminal state or it's not humans turn, return false
			if (hasClass(html_cells[index], 'x') || hasClass(html_cells[index], 'o') || b.isTerminal() || !player_turn) return false;

			let symbol = maximizing ? 'x' : 'o'; //Maximizing player is always 'x'

			//Update the Board class instance as well as the Board UI
			b.insert(symbol, index);
			addClass(html_cells[index], symbol);

			//If it's a terminal move and it's not a draw, then human won
			if (b.isTerminal()) {
				let { winner } = b.isTerminal();
				if (winner !== 'draw') addClass(document.getElementById("charachters"), 'celebrate_human');
				drawWinningLine(b.isTerminal());
			}
			player_turn = 0; //Switch turns

			//Get computer's best move and update the UI
			p.getBestMove(b, !maximizing, best => {
				let symbol = !maximizing ? 'x' : 'o';
				b.insert(symbol, best);
				addClass(html_cells[best], symbol);
				if (b.isTerminal()) {
					let { winner } = b.isTerminal();
					if (winner !== 'draw') addClass(document.getElementById("charachters"), 'celebrate_robot');
					drawWinningLine(b.isTerminal());
				}
				player_turn = 1; //Switch turns
			});
		}, false);
		if (cell) addClass(html_cells[index], cell);
	});
}

document.addEventListener("DOMContentLoaded", event => {

	//Start a new game when page loads with default values
	let depth = -1;
	let starting_player = 1;
	newGame(depth, starting_player);

	//Events handlers for depth, starting player options
	document.getElementById("depth").addEventListener("click", event => {
		if (event.target.tagName !== "LI" || hasClass(event.target, 'active')) return;
		let depth_choices = [...document.getElementById("depth").children[0].children];
		depth_choices.forEach(choice => {
			removeClass(choice, 'active');
		});
		addClass(event.target, 'active');
		depth = event.target.dataset.value;
	}, false);

	document.getElementById("starting_player").addEventListener("click", event => {
		if (event.target.tagName !== "LI" || hasClass(event.target, 'active')) return;
		let starting_player_choices = [...document.getElementById("starting_player").children[0].children];
		starting_player_choices.forEach(choice => {
			removeClass(choice, 'active');
		});
		addClass(event.target, 'active');
		starting_player = event.target.dataset.value;
	}, false);

	document.getElementById("newgame").addEventListener('click', () => {
		newGame(depth, starting_player);
	});
});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map