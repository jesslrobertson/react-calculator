import React from 'react'
import './App.css';
import Calculator from './Calculator';

export const ACTIONS = {
  INPUT_DIGIT: "input",
  CLEAR: "clear",
  BACKSPACE: "backspace",
  OPERATION: "operation",
  OPEN_BRACKET: 'openBracket',
  CLOSE_BRACKET: 'closeBracket',
  TOTAL: "total",
};

function App() {
  return (
    <div className="App">
      <Calculator />
    </div>
  );
}

export default App;
