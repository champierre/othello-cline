class Othello {
    constructor() {
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        this.currentPlayer = 'black';
        this.setupEventListeners();
        this.initialize();
    }

    initialize() {
        // 初期配置
        this.board[3][3] = 'white';
        this.board[3][4] = 'black';
        this.board[4][3] = 'black';
        this.board[4][4] = 'white';
        this.renderBoard();
        this.updateTurnDisplay();
    }

    setupEventListeners() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => this.handleCellClick(i, j));
                boardElement.appendChild(cell);
            }
        }

        document.getElementById('reset-button').addEventListener('click', () => this.reset());
    }

    renderBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.className = 'cell';
                if (this.board[i][j]) {
                    cell.classList.add(this.board[i][j]);
                }
            }
        }
    }

    handleCellClick(row, col) {
        if (this.board[row][col] || !this.isValidMove(row, col)) {
            return;
        }

        this.makeMove(row, col);
        
        if (!this.hasValidMoves(this.getOpponentColor())) {
            if (!this.hasValidMoves(this.currentPlayer)) {
                this.endGame();
                return;
            }
        } else {
            this.currentPlayer = this.getOpponentColor();
        }
        
        this.updateTurnDisplay();
    }

    isValidMove(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        return directions.some(([dx, dy]) => this.isValidDirection(row, col, dx, dy));
    }

    isValidDirection(row, col, dx, dy) {
        let x = row + dx;
        let y = col + dy;
        let hasOpponentPiece = false;

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (!this.board[x][y]) {
                return false;
            }
            if (this.board[x][y] === this.currentPlayer) {
                return hasOpponentPiece;
            }
            hasOpponentPiece = true;
            x += dx;
            y += dy;
        }

        return false;
    }

    makeMove(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        this.board[row][col] = this.currentPlayer;

        directions.forEach(([dx, dy]) => {
            if (this.isValidDirection(row, col, dx, dy)) {
                this.flipDirection(row, col, dx, dy);
            }
        });

        this.renderBoard();
    }

    flipDirection(row, col, dx, dy) {
        let x = row + dx;
        let y = col + dy;

        while (this.board[x][y] === this.getOpponentColor()) {
            this.board[x][y] = this.currentPlayer;
            x += dx;
            y += dy;
        }
    }

    hasValidMoves(player) {
        const currentPlayer = this.currentPlayer;
        this.currentPlayer = player;
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!this.board[i][j] && this.isValidMove(i, j)) {
                    this.currentPlayer = currentPlayer;
                    return true;
                }
            }
        }
        
        this.currentPlayer = currentPlayer;
        return false;
    }

    getOpponentColor() {
        return this.currentPlayer === 'black' ? 'white' : 'black';
    }

    updateTurnDisplay() {
        const display = document.getElementById('turn-display');
        display.textContent = `${this.currentPlayer === 'black' ? '黒' : '白'}の番です`;
    }

    endGame() {
        let blackCount = 0;
        let whiteCount = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] === 'black') blackCount++;
                if (this.board[i][j] === 'white') whiteCount++;
            }
        }

        const display = document.getElementById('turn-display');
        if (blackCount > whiteCount) {
            display.textContent = `ゲーム終了 - 黒の勝ち (黒: ${blackCount}, 白: ${whiteCount})`;
        } else if (whiteCount > blackCount) {
            display.textContent = `ゲーム終了 - 白の勝ち (黒: ${blackCount}, 白: ${whiteCount})`;
        } else {
            display.textContent = `ゲーム終了 - 引き分け (黒: ${blackCount}, 白: ${whiteCount})`;
        }
    }

    reset() {
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        this.currentPlayer = 'black';
        this.initialize();
    }
}

// DOMの読み込み完了後にゲームを開始
document.addEventListener('DOMContentLoaded', () => {
    new Othello();
});
