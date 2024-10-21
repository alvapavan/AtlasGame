import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentLetter, setCurrentLetter] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = () => {
    setIsLoading(true);
    fetch('http://localhost:8000/start', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setCurrentLetter(data.current_letter);
        setGameStatus(data.message);
        setGameOver(false);
      })
      .catch(error => {
        console.error("Error starting game:", error);
        setGameStatus('Failed to start the game.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleOpponentTurn = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('http://localhost:8000/opponent-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: inputValue }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.detail) });
        }
        return response.json();
      })
      .then(data => {
        setGameStatus(`Your word: ${data.opponent_word}`);
        setCurrentLetter(data.next_letter);
        setInputValue('');
        handleSystemTurn();
      })
      .catch(error => {
        console.error("Error during opponent turn:", error);
        setGameStatus(error.message || 'Invalid move. Try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleSystemTurn = () => {
    setIsLoading(true);
    fetch('http://localhost:8000/system-turn')
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setGameStatus(data.message);
          setGameOver(true);
        } else {
          setGameStatus(`System's word: ${data.system_word}`);
          setCurrentLetter(data.next_letter);
        }
      })
      .catch(error => {
        console.error("Error during system turn:", error);
        setGameStatus('Error during system turn.');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Atlas Game</h1>

        {gameOver ? (
          <div className="text-center">
            <p className="text-xl mb-6 text-gray-700">{gameStatus}</p>
            <button
              onClick={startGame}
              disabled={isLoading}
              className={`w-full py-3 px-6 font-bold text-white rounded-full transition duration-300 ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? 'Starting...' : 'Start New Game'}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-purple-600 mb-6">{gameStatus}</p>
            {currentLetter && (
              <p className="text-2xl font-bold text-purple-600 mb-6">
                Current Letter: <span className="text-blue-500">{currentLetter}</span>
              </p>
            )}
            <form onSubmit={handleOpponentTurn} className="flex flex-col items-center space-y-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                placeholder="Enter a country name"
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 font-bold text-white rounded-full transition duration-300 ${
                  isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 transform hover:-translate-y-1'
                }`}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
            <button
              onClick={startGame}
              disabled={isLoading}
              className={`w-full py-2 px-6 font-bold text-white rounded-full transition duration-300 ${
                isLoading ? 'bg-gray-200' : 'bg-blue-400 hover:bg-blue-600 transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? 'Starting...' : 'Start New Game'}              
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;