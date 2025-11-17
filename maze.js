(() => {
    const canvas = document.getElementById("mazeCanvas");
    const ctx = canvas.getContext("2d");
    const mazeSizeSelect = document.getElementById("mazeSize");
    const generateButton = document.getElementById("generateMaze");
    const solveButton = document.getElementById("solveMaze");
    const statusEl = document.getElementById("mazeStatus");

    let currentMaze = null;
    let currentPath = null;
    let playerCell = null;
    let playerTrail = [];

    const directionMap = {
        ArrowUp: { wall: "top", rowOffset: -1, colOffset: 0, label: "up" },
        ArrowDown: { wall: "bottom", rowOffset: 1, colOffset: 0, label: "down" },
        ArrowLeft: { wall: "left", rowOffset: 0, colOffset: -1, label: "left" },
        ArrowRight: { wall: "right", rowOffset: 0, colOffset: 1, label: "right" }
    };

    class Maze {
        constructor(size) {
            this.size = size;
            this.grid = [];
            for (let row = 0; row < size; row++) {
                const rowCells = [];
                for (let col = 0; col < size; col++) {
                    rowCells.push({
                        row,
                        col,
                        walls: { top: true, right: true, bottom: true, left: true },
                        visited: false
                    });
                }
                this.grid.push(rowCells);
            }
        }

        cell(row, col) {
            if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
                return null;
            }
            return this.grid[row][col];
        }

        generate() {
            const stack = [];
            let current = this.cell(0, 0);
            current.visited = true;

            const directions = [
                { name: "top", rowOffset: -1, colOffset: 0, opposite: "bottom" },
                { name: "right", rowOffset: 0, colOffset: 1, opposite: "left" },
                { name: "bottom", rowOffset: 1, colOffset: 0, opposite: "top" },
                { name: "left", rowOffset: 0, colOffset: -1, opposite: "right" }
            ];

            while (true) {
                const neighbors = directions
                    .map(dir => ({
                        dir,
                        cell: this.cell(current.row + dir.rowOffset, current.col + dir.colOffset)
                    }))
                    .filter(option => option.cell && !option.cell.visited);

                if (neighbors.length > 0) {
                    const { cell: nextCell, dir } = neighbors[Math.floor(Math.random() * neighbors.length)];
                    current.walls[dir.name] = false;
                    nextCell.walls[dir.opposite] = false;
                    stack.push(current);
                    current = nextCell;
                    current.visited = true;
                } else if (stack.length > 0) {
                    current = stack.pop();
                } else {
                    break;
                }
            }

            // Reset visited flags for solving
            for (const row of this.grid) {
                for (const cell of row) {
                    cell.visited = false;
                }
            }
        }

        solve() {
            const queue = [];
            const start = this.cell(0, 0);
            const end = this.cell(this.size - 1, this.size - 1);
            const cameFrom = new Map();

            const key = (cell) => `${cell.row},${cell.col}`;

            queue.push(start);
            cameFrom.set(key(start), null);

            while (queue.length > 0) {
                const current = queue.shift();
                if (current === end) {
                    break;
                }

                for (const neighbor of this._accessibleNeighbors(current)) {
                    const neighborKey = key(neighbor);
                    if (!cameFrom.has(neighborKey)) {
                        queue.push(neighbor);
                        cameFrom.set(neighborKey, current);
                    }
                }
            }

            if (!cameFrom.has(key(end))) {
                return [];
            }

            const path = [];
            let current = end;
            while (current) {
                path.push(current);
                current = cameFrom.get(key(current));
            }
            path.reverse();
            return path;
        }

        _accessibleNeighbors(cell) {
            const neighbors = [];
            const { row, col, walls } = cell;
            if (!walls.top) {
                neighbors.push(this.cell(row - 1, col));
            }
            if (!walls.right) {
                neighbors.push(this.cell(row, col + 1));
            }
            if (!walls.bottom) {
                neighbors.push(this.cell(row + 1, col));
            }
            if (!walls.left) {
                neighbors.push(this.cell(row, col - 1));
            }
            return neighbors.filter(Boolean);
        }
    }

    function drawMaze(maze, options = {}) {
        const {
            solution = [],
            player = null,
            trail = []
        } = options;
        const { size } = maze;
        const pad = 20;
        const drawableWidth = canvas.width - pad * 2;
        const drawableHeight = canvas.height - pad * 2;
        const cellSize = Math.min(drawableWidth, drawableHeight) / size;
        const offsetX = (canvas.width - cellSize * size) / 2;
        const offsetY = (canvas.height - cellSize * size) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.lineCap = "square";
        ctx.strokeStyle = "#0b1b3a";

        for (const row of maze.grid) {
            for (const cell of row) {
                const x = offsetX + cell.col * cellSize;
                const y = offsetY + cell.row * cellSize;

                // Fill start and end cells.
                if (cell.row === 0 && cell.col === 0) {
                    ctx.fillStyle = "rgba(46, 125, 50, 0.25)";
                    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                } else if (cell.row === maze.size - 1 && cell.col === maze.size - 1) {
                    ctx.fillStyle = "rgba(211, 47, 47, 0.25)";
                    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                }

                ctx.beginPath();
                if (cell.walls.top) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + cellSize, y);
                }
                if (cell.walls.right) {
                    ctx.moveTo(x + cellSize, y);
                    ctx.lineTo(x + cellSize, y + cellSize);
                }
                if (cell.walls.bottom) {
                    ctx.moveTo(x, y + cellSize);
                    ctx.lineTo(x + cellSize, y + cellSize);
                }
                if (cell.walls.left) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + cellSize);
                }
                ctx.stroke();
            }
        }

        if (trail.length > 1) {
            ctx.strokeStyle = "#4caf50";
            ctx.lineWidth = cellSize / 4;
            ctx.lineJoin = "round";
            ctx.beginPath();
            const first = trail[0];
            ctx.moveTo(
                offsetX + first.col * cellSize + cellSize / 2,
                offsetY + first.row * cellSize + cellSize / 2
            );
            for (let i = 1; i < trail.length; i++) {
                const step = trail[i];
                ctx.lineTo(
                    offsetX + step.col * cellSize + cellSize / 2,
                    offsetY + step.row * cellSize + cellSize / 2
                );
            }
            ctx.stroke();
        }

        if (solution.length > 1) {
            ctx.strokeStyle = "#ff8f00";
            ctx.lineWidth = cellSize / 3;
            ctx.lineJoin = "round";
            ctx.beginPath();
            const first = solution[0];
            ctx.moveTo(
                offsetX + first.col * cellSize + cellSize / 2,
                offsetY + first.row * cellSize + cellSize / 2
            );
            for (let i = 1; i < solution.length; i++) {
                const step = solution[i];
                ctx.lineTo(
                    offsetX + step.col * cellSize + cellSize / 2,
                    offsetY + step.row * cellSize + cellSize / 2
                );
            }
            ctx.stroke();
        }

        if (player) {
            const centerX = offsetX + player.col * cellSize + cellSize / 2;
            const centerY = offsetY + player.row * cellSize + cellSize / 2;
            const radius = Math.max(cellSize / 4, 6);
            ctx.fillStyle = "#ff7043";
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
        }
    }

    function renderMaze() {
        if (!currentMaze) {
            return;
        }
        drawMaze(currentMaze, {
            solution: currentPath || [],
            player: playerCell,
            trail: playerTrail
        });
    }

    function handleGenerate() {
        const size = parseInt(mazeSizeSelect.value, 10);
        if (Number.isNaN(size) || size < 5) {
            statusEl.textContent = "Please choose a valid maze size.";
            return;
        }
        currentMaze = new Maze(size);
        currentMaze.generate();
        currentPath = null;
        playerCell = { row: 0, col: 0 };
        playerTrail = [{ row: 0, col: 0 }];
        renderMaze();
        solveButton.disabled = false;
        statusEl.textContent = `Maze generated with a ${size} by ${size} grid. Try solving it!`;
    }

    function handleSolve() {
        if (!currentMaze) {
            statusEl.textContent = "Generate a maze first.";
            return;
        }
        currentPath = currentMaze.solve();
        if (currentPath.length === 0) {
            statusEl.textContent = "No path could be found. Generate a new maze.";
            return;
        }
        renderMaze();
        statusEl.textContent = `Solution path displayed in ${currentPath.length - 1} moves.`;
    }

    function attemptMove(directionKey) {
        if (!currentMaze || !playerCell) {
            return;
        }
        const currentCell = currentMaze.cell(playerCell.row, playerCell.col);
        const direction = directionMap[directionKey];
        if (!direction) {
            return;
        }
        if (currentCell.walls[direction.wall]) {
            statusEl.textContent = `Wall ahead! Can't move ${direction.label}.`;
            return;
        }
        const nextCell = currentMaze.cell(
            playerCell.row + direction.rowOffset,
            playerCell.col + direction.colOffset
        );
        if (!nextCell) {
            statusEl.textContent = "Can't move outside the maze boundaries.";
            return;
        }
        playerCell = { row: nextCell.row, col: nextCell.col };
        playerTrail.push({ row: playerCell.row, col: playerCell.col });
        currentPath = null;
        renderMaze();
        if (playerCell.row === currentMaze.size - 1 && playerCell.col === currentMaze.size - 1) {
            statusEl.textContent = "You escaped the maze! Press Generate for a new challenge.";
        } else {
            statusEl.textContent = `Moved ${direction.label}.`;
        }
    }

    function handleKeydown(event) {
        if (!directionMap[event.key]) {
            return;
        }
        event.preventDefault();
        if (!currentMaze) {
            statusEl.textContent = "Generate a maze first, then use the arrow keys to explore.";
            return;
        }
        attemptMove(event.key);
    }

    generateButton.addEventListener("click", handleGenerate);
    solveButton.addEventListener("click", handleSolve);
    window.addEventListener("keydown", handleKeydown, { passive: false });

    // Draw placeholder grid frame.
    ctx.fillStyle = "#f0f4ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#90caf9";
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
})();
