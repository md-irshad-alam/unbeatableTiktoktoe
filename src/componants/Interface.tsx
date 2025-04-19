"use client";

import React, { useRef, useState, useEffect } from "react";

const InterfaceUi = () => {
  const [currentPlayer, setCurrentPlayer] = useState<boolean>(false); // false = Human (X), true = Computer (O)
  const [winner, setWinner] = useState<string | null>(null);
  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);

  const startGame = () => {
    setWinner(null);
    setCurrentPlayer(false);
    boxesRef.current.forEach((box) => {
      if (box) box.innerText = "";
    });
  };

  const checkWinner = () => {
    for (let pattern of boardPatterns) {
      const [a, b, c] = pattern;
      const valA = boxesRef.current[a]?.innerText;
      const valB = boxesRef.current[b]?.innerText;
      const valC = boxesRef.current[c]?.innerText;
      if (valA && valA === valB && valB === valC) {
        setWinner(valA === "X" ? "Human" : "Computer");
        return;
      }
    }
  };

  const checkWinnerSim = (board: string[], player: string): boolean => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winPatterns.some((pattern) =>
      pattern.every((index) => board[index] === player)
    );
  };

  const humanPlay = (index: number) => {
    const box = boxesRef.current[index];
    if (!box || box.innerText || winner) return;
    box.innerText = "X";
    setCurrentPlayer(true);
    checkWinner();
    setTimeout(() => {
      generateSmartMove();
    }, 1000);
  };

  const boardPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  //   const generateSmartMove = () => {
  //     const board = boxesRef.current.map((box) => box?.innerText || "");
  //     const emptyIndexes = board
  //       .map((val, i) => (!val ? i : null))
  //       .filter((i) => i !== null) as number[];

  //     if (emptyIndexes.length === 0 || winner) return;

  //     const playerMoves = board
  //       .map((val, i) => (val === "X" ? i : null))
  //       .filter((i) => i !== null) as number[];

  //     let smartMove: number | null = null;

  //     // Prioritize: center, corners, strategic edge
  //     if (playerMoves.includes(0)) {
  //       smartMove = [1, 3, 4, 6, 2].find((i) => emptyIndexes.includes(i)) || null;
  //     } else if (playerMoves.includes(4)) {
  //       smartMove = [1, 3, 5, 7, 8].find((i) => emptyIndexes.includes(i)) || null;
  //     } else if (playerMoves.includes(2)) {
  //       smartMove = [1, 5, 4, 0, 8].find((i) => emptyIndexes.includes(i)) || null;
  //     } else if (playerMoves.includes(2)) {
  //       smartMove = [1, 5, 4, 0, 8].find((i) => emptyIndexes.includes(i)) || null;
  //     }

  //     // If no specific logic matched, just pick center, corner, then edge
  //     if (smartMove === null) {
  //       const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  //       smartMove =
  //         preferredOrder.find((i) => emptyIndexes.includes(i)) || emptyIndexes[0];
  //     }

  //     computerPlay(smartMove);
  //   };
  const generateSmartMove = () => {
    const board = boxesRef.current.map((box) => box?.innerText || "");
    const emptyIndexes = board
      .map((val, i) => (!val ? i : null))
      .filter((i) => i !== null) as number[];

    if (emptyIndexes.length === 0 || winner) return;

    const bestMove = getBestMove(board, "O"); // "O" is computer
    if (typeof bestMove === "number") {
      computerPlay(bestMove);
    }
  };

  const getBestMove = (board: string[], player: "X" | "O"): number | null => {
    const emptySpots = board
      .map((val, i) => (!val ? i : null))
      .filter((i) => i !== null) as number[];

    let bestScore = -Infinity;
    let move: number | null = null;

    for (const i of emptySpots) {
      board[i] = player;
      const score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }

    return move;
  };

  const minimax = (
    board: string[],
    depth: number,
    isMaximizing: boolean
  ): number => {
    if (checkWinnerSim(board, "O")) return 10 - depth; // Computer wins
    if (checkWinnerSim(board, "X")) return depth - 10; // Human wins
    if (!board.includes("")) return 0; // Tie

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = "O";
          const score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = "X";
          const score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const computerPlay = (index: number) => {
    const box = boxesRef.current[index];
    if (!box || box.innerText || winner) return;
    box.innerText = "O";
    setCurrentPlayer(false);
    checkWinner();
  };

  return (
    <div className="w-[95%]  absolute top-0 bottom-0 m-auto  bg-gradient-to-br from-purple-600 via-pink-400 to-yellow-300 flex flex-col items-center justify-start pt-2 text-white  overflow-hidden">
      <div className="mb-4 flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-widest drop-shadow-lg animate-pulse">
          Tic Tac Toe
        </h1>
        <button
          onClick={startGame}
          className="px-6 py-2 bg-white text-purple-600 font-bold rounded-full shadow-md hover:bg-purple-100 hover:scale-105 transition duration-300"
        >
          Restart Game
        </button>
      </div>

      <div className="w-[90%] max-w-2xl flex justify-between items-center text-white p-4 bg-white/20 backdrop-blur-md rounded-xl shadow-xl mb-8">
        <div
          className={`flex flex-col items-center w-[40%] py-3 rounded-lg transition-all duration-300 ${
            !currentPlayer ? "bg-blue-500/70 shadow-inner" : "bg-gray-300/30"
          }`}
        >
          <h5 className="text-lg font-semibold">👤 Human (X)</h5>
        </div>
        <div
          className={`flex flex-col items-center w-[40%] py-3 rounded-lg transition-all duration-300 ${
            currentPlayer ? "bg-blue-500/70 shadow-inner" : "bg-gray-300/30"
          }`}
        >
          <h5 className="text-lg font-semibold">🤖 Computer (O)</h5>
        </div>
      </div>

      <div className="text-xl font-bold mb-6 animate-fade-in">
        {winner ? (
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-yellow-300 animate-gradient-text text-3xl font-extrabold shadow-xl">
            🎉 {winner} Wins!
          </span>
        ) : (
          <span>Turn: {currentPlayer ? "Computer 🤖" : "Human 👤"}</span>
        )}
      </div>

      <div className="w-[90vw] max-w-[500px] grid grid-cols-3 gap-3 p-4 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            ref={(el: HTMLDivElement | null) => {
              boxesRef.current[index] = el;
            }}
            onClick={() => !currentPlayer && humanPlay(index)}
            className="h-[100px] sm:h-[120px] flex items-center justify-center text-4xl sm:text-5xl font-extrabold bg-white/60 text-purple-700 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default InterfaceUi;
