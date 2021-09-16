//I'm defining these variables here so they're accessible
//in the init and other child scopes

//rootNode needs to be accessible from everything
//but no guarantee that the DOM is ready
//to do an ID lookup right now, so assign it in init
let rootNode;

//our array of button dom elements
let buttonNodes = [
	[], //row 0
	[], //row 1
	[] //row 2
];

// array to keep track of available nodes
let availableNodes = [];

// onclick -> runs every time user clicks on a button
const onclick = function () {
	// starter code
	console.log(this);

	// get row and column, store in abbreviated vars
	const r = this.row;
	const c = this.col;

	// set button to be owned by X
	this.innerHTML = "X";
	this.owned = "X";
	this.disabled = true;

	// delete this from available nodes
	availableNodes[r].splice(availableNodes[r].indexOf(this), 1);

	// if win or tie, run the endgame function
	// put into timeout for better "game-like" flow
	setTimeout(function () {
		if (check_win() || check_tie()) end();
		// if no win, let the ai have its turn
		else ai_turn();
	}, 50);

};

// refresh -> reloads the page
const refresh = function () {
	window.location.reload();
};

// ai_turn -> events pertaining to the AI taking a turn
const ai_turn = function () {
	// create array rows of all possible rows on board
	const rows = [];
	for (let row = 0; row < buttonNodes.length; row++) rows.push(row);

	// filter out rows that have no available spaces, store in array nonempty
	const nonempty = rows.filter(row => availableNodes[row].length > 0);

	// r -> random row from the array nonempty
	let r;
	// if array length is 1, get first element
	if (nonempty.length == 1) {
		r = nonempty[0];
	}
	// else, get random element from array
	else {
		r = nonempty[Math.floor(Math.random() * nonempty.length)];
	}

	// c -> random column from the random row of board
	const c = Math.floor(Math.random() * availableNodes[r].length);

	// get the node pointed to by r and c
	const node = availableNodes[r][c];

	// set this node to be taken by O
	node.innerHTML = "O";
	node.owned = "O";
	node.disabled = true;

	// remove node from availableNodes array
	availableNodes[r].splice(c, 1);


	// if win or tie, end game
	// put into timeout for better "game-like" flow
	setTimeout(function () {
		if (check_win() || check_tie()) end();
	}, 50);


};


// WIN CHECK FUNCTIONS LOGIC: 
// Get an array of relevant nodes, filter into Xs and Os.
// If length of Xs OR Os == length of board, then a win has occurred

// horz_win -> iterate through each row for array of relevant nodes
const horz_win = function () {
	for (let r = 0; r < buttonNodes.length; r++) {
		const Xs = buttonNodes[r].filter(node => node.owned == "X");
		const Os = buttonNodes[r].filter(node => node.owned == "O");
		if (Xs.length == buttonNodes.length) {
			window.alert("Player X won horizontally!")
			return true;
		} else if (Os.length == buttonNodes.length) {
			window.alert("Player O won horizontally!")
			return true;
		}

	}
	return false;
};

// vert_win -> iterate through each column, create array of relevant nodes for each col
const vert_win = function () {
	for (let c = 0; c < buttonNodes.length; c++) {
		const col = [];
		for (let r = 0; r < buttonNodes.length; r++) {
			col.push(buttonNodes[r][c])
		}
		const Xs = col.filter(node => node.owned == "X");
		const Os = col.filter(node => node.owned == "O");
		if (Xs.length == buttonNodes.length) {
			window.alert("Player X won vertically!")
			return true;
		} else if (Os.length == buttonNodes.length) {
			window.alert("Player O won vertically!")
			return true;
		}
	}
	return false;

};


// ndiag_win -> get \ path of nodes from board
const ndiag_win = function () {
	const ndiag = [];
	for (let r = 0, c = 0; r < buttonNodes.length; r++, c++) {
		ndiag.push(buttonNodes[r][c]);
	}
	const Xs = ndiag.filter(node => node.owned == "X");
	const Os = ndiag.filter(node => node.owned == "O");
	if (Xs.length == buttonNodes.length) {
		window.alert("Player X won diagonally (\\)!")
		return true;
	} else if (Os.length == buttonNodes.length) {
		window.alert("Player O won diagonally (\\)!")
		return true;
	}

	return false;

};

// pdiag_win -> get / path of nodes from board
const pdiag_win = function () {
	const pdiag = [];
	for (let r = buttonNodes.length - 1, c = 0; r >= 0; r--, c++) {
		pdiag.push(buttonNodes[r][c]);
	}

	const Xs = pdiag.filter(node => node.owned == "X");
	const Os = pdiag.filter(node => node.owned == "O");
	if (Xs.length == buttonNodes.length) {
		window.alert("Player X won diagonally (//)!")
		return true;
	} else if (Os.length == buttonNodes.length) {
		window.alert("Player O won diagonally (//)!")
		return true;
	}
	return false;
};

// check_win -> checks for ANY type of win, returns true if at least one
const check_win = function () {
	return horz_win() || vert_win() || ndiag_win() || pdiag_win();
};

// check_tie -> checks for tie by seeing if ALL rows are empty
const check_tie = function () {
	for (let r = 0; r < availableNodes.length; r++) {
		if (availableNodes[r].length != 0) return false;
	}
	window.alert("Tie game!");
	return true;
};

// ai_go_first -> runs ai_turn(), then disables ai first button
const ai_go_first = function () {
	ai_turn();
	document.getElementById("ai_first").disabled = true;
};

// more starter code
//this gets called by the 'load' event listener
const init = function () {
	console.log("init");
	rootNode = document.getElementById("app");

	//create and add the 9 game board buttons
	//to the array and to DOM
	//assign an onclick callback
	for (let i = 0; i < 3; i++) {
		let rowDivNode = document.createElement("div");
		rowDivNode.className = "row";
		for (let j = 0; j < 3; j++) {
			let btn = (buttonNodes[i][j] = document.createElement("button"));
			btn.innerHTML = "_";
			btn.owned = false;
			btn.row = i;
			btn.col = j;
			btn.onclick = onclick;
			rowDivNode.appendChild(btn);
		}
		rootNode.appendChild(rowDivNode);
	}

	//create and add the "AI Go First" button
	let ai_first = document.createElement("button");
	ai_first.innerHTML = "AI Go First";
	ai_first.onclick = ai_go_first;
	ai_first.id = "ai_first";


	//create a reload button here if you want?
	let reload = document.createElement("button");
	reload.id = "reload";
	reload.innerHTML = "Reload";
	reload.disabled = true;
	reload.onclick = refresh;

	// options bar containing reload and ai go first button
	let options = document.createElement("div");
	options.id = "options";

	options.appendChild(ai_first);
	options.appendChild(reload);

	rootNode.appendChild(options);

	// copy of button nodes array to keep track of available nodes
	for (let n = 0; n < buttonNodes.length; n++) {
		availableNodes[n] = buttonNodes[n].slice();
	}

};

// endgame function, disables all buttons except reload
const end = function () {
	document.getElementById("reload").disabled = false;
	document.getElementById("ai_first").disabled = true;

	for (let r = 0; r < buttonNodes.length; r++) {
		for (let c = 0; c < buttonNodes.length; c++) {
			buttonNodes[r][c].disabled = true;
		}
	}
};

//called once page is laded,
//DOM is ready and has all it's nodes loaded
//console.log("adding init");
window.addEventListener("load", init);
