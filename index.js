document.addEventListener('DOMContentLoaded', () => {
	const ROWS = 40;
	const COLS = 40;

	/**
	 * @description To globally store the setInterval id when the game is started.
	 * Will be used to stop the game
	 */
	let startGameIntervalId = null;

	/**
	 * @description Wrapper element to store rows and columns of the cells
	 * @type {HTMLTableElement}
	 */
	const canvas = document.getElementById('canvas');

	/**
	 * @type {HTMLButtonElement}
	 */
	const startBtn = document.getElementById('start-btn');
	startBtn.addEventListener('click', startGame);

	/**
	 * @type {HTMLButtonElement}
	 */
	const stopBtn = document.getElementById('stop-btn');
	stopBtn.addEventListener('click', stopGame);

	/**
	 * @description Initial ROWS x COLS grid to be rendered in the UI
	 * @type {number[][]}
	 */
	let initialCellGrid = Array.from({ length: ROWS }, () =>
		new Array(COLS).fill(0)
	);

	/**
	 * @description - This is to mark(populate)/unmark(unpopulate) a single cell.
	 *
	 * @param {MouseEvent} event
	 */
	function handleCellClick(event) {
		const row = event.target.dataset.row;
		const col = event.target.dataset.col;

		initialCellGrid[row][col] = initialCellGrid[row][col] === 0 ? 1 : 0;

		event.currentTarget.classList.toggle('selected');
	}

	/**
	 * @description - This creates an initial ROWS x COLS grid in the browser
	 * and attaches appropriate event listeners to it.
	 */
	function renderUI() {
		for (let row = 0; row < ROWS; row++) {
			const cellRow = document.createElement('tr');
			cellRow.classList.add('cell-row');

			for (let col = 0; col < COLS; col++) {
				const cell = document.createElement('td');
				cell.classList.add('cell');

				cell.dataset.row = row;
				cell.dataset.col = col;

				if (initialCellGrid[row][col] === 1) {
					cell.classList.add('selected');
				}

				cell.addEventListener('click', handleCellClick);

				cellRow.appendChild(cell);
			}

			canvas.appendChild(cellRow);
		}
	}

	/**
	 * @description updates all the cells state in the UI based on the the current grid state
	 * @param {number[][]} gridState - The state based on which new UI will be rendered
	 */
	function updateUI(gridState) {
		const cells = document.querySelectorAll('.cell');

		cells.forEach((cell) => {
			const row = parseInt(cell.dataset.row);
			const col = parseInt(cell.dataset.col);

			if (gridState[row][col]) {
				cell.classList.add('selected');
			} else {
				cell.classList.remove('selected');
			}
		});
	}

	function calcCellState({ gridState, coords }) {
		let neighbours = 0;

		// calculate the number of neighbours for current cell
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (
					// to check if the neighbour is inside the bounds of the grid
					coords.row + i >= 0 &&
					coords.row + i < ROWS &&
					coords.row + j >= 0 &&
					coords.row + j < COLS &&
					// to check if it's not the current cell
					(i !== 0 || j !== 0)
				) {
					neighbours += gridState[coords.row + i][coords.col + j];
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
		// creating a copy because the complete next state is calculated from the whole current state
		// thus can't update the current state one by one. It needs to be updated as a whole.
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

		startGameIntervalId = setInterval(() => {
			initialCellGrid = calcUpdatedGridState(initialCellGrid);
			updateUI(initialCellGrid);
		}, 200);
	}

	function stopGame() {
		startBtn.classList.remove('hide');
		stopBtn.classList.add('hide');
		clearInterval(startGameIntervalId);
	}

	renderUI();
});
