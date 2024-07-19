document.addEventListener('DOMContentLoaded', () => {
	const ROWS = 50;
	const COLS = 50;

	let intervalId = null;

	const canvas = document.getElementById('canvas');

	const startBtn = document.getElementById('start-btn');
	startBtn.addEventListener('click', startGame);

	const stopBtn = document.getElementById('stop-btn');
	stopBtn.addEventListener('click', stopGame);

	let initialCellGrid = Array.from({ length: COLS }, () =>
		new Array(ROWS).fill(0)
	);

	/**
	 * @description - This created a ROWS x COLS grid in the browser
	 * and attaches appropriate event listeners to it.
	 */
	function drawGrid(gridState) {
		canvas.innerHTML = '';

		for (let row = 0; row < ROWS; row++) {
			const cellRow = document.createElement('tr');
			cellRow.classList.add('cell-row');

			for (let col = 0; col < COLS; col++) {
				const cell = document.createElement('td');
				cell.classList.add('cell');

				cell.dataset.row = row;
				cell.dataset.col = col;

				if (gridState[row][col] === 1) {
					cell.classList.add('selected');
				}

				cell.addEventListener('click', handleCellClick);

				cellRow.appendChild(cell);
			}

			canvas.appendChild(cellRow);
		}
	}

	function calcCellState({ gridState, coords }) {
		// console.log(gridState);

		let neighbours = 0;

		// calculate the number of neighbours for current cell
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (
					coords.row + i >= 0 &&
					coords.row + i < ROWS &&
					coords.row + j >= 0 &&
					coords.row + j < COLS
				) {
					if (i !== 0 || j !== 0) {
						neighbours += gridState[coords.row + i][coords.col + j];
					}
				}
			}
		}

		const currState = gridState[coords.row][coords.col];

		let newState = 0;

		// if the cell is populated/alive
		if (currState) {
			if (neighbours >= 2 && neighbours <= 3) newState = 1;
		} else {
			if (neighbours === 3) newState = 1;
		}

		return newState;
	}

	function calcUpdatedGridState(currGridState) {
		const updatedState = JSON.parse(JSON.stringify(currGridState));

		for (let i = 0; i < ROWS; i++) {
			for (let j = 0; j < COLS; j++) {
				updatedState[i][j] = calcCellState({
					gridState: currGridState,
					coords: {
						row: i,
						col: j,
					},
				});
			}
		}

		return updatedState;
	}

	function startGame() {
		startBtn.classList.add('hide');
		stopBtn.classList.remove('hide');

		intervalId = setInterval(() => {
			initialCellGrid = calcUpdatedGridState(initialCellGrid);
			drawGrid(initialCellGrid);
		}, 200);
	}

	function stopGame() {
		startBtn.classList.remove('hide');
		stopBtn.classList.add('hide');
		clearInterval(intervalId);
	}

	/**
	 * @description - This is to mark/unmark cells while the game has not started.
	 * @param {MouseEvent} event
	 */
	function handleCellClick(event) {
		const row = event.target.dataset.row;
		const col = event.target.dataset.col;

		initialCellGrid[row][col] = initialCellGrid[row][col] === 0 ? 1 : 0;

		event.currentTarget.classList.toggle('selected');
	}

	drawGrid(initialCellGrid);
});
