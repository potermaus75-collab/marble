import Board from './Board.js';
import Game from './Game.js';

window.onload = () => {
    const board = new Board();
    const game = new Game(board);
    
    // 모바일 주소창 숨기기용
    window.scrollTo(0, 1);
};
