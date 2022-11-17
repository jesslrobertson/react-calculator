import React, { useReducer, useState } from "react";
import NumButton from "./NumButton";
import OperationButton from "./OperationButton";
import { ACTIONS } from "./App";

export default function Calculator() {
  const {
    INPUT_DIGIT,
    CLEAR,
    BACKSPACE,
    OPERATION,
    OPEN_BRACKET,
    CLOSE_BRACKET,
    TOTAL,
  } = ACTIONS;

  const initState = {
    current: null,
    previous: null,
    operation: null,
    negative: false,
    replace: false,
    outsideNum: null,
    outsideOp: null,
    inBrackets: false,
  };

  const [bracketTotal, setBracketTotal] = useState(null);

  function calcReducer(state, { type, value }) {
    console.log(type, value);
    let newState;
    switch (type) {
      case INPUT_DIGIT:
        if (state.replace) {
          newState = {
            ...state,
            current: value,
            replace: false,
          };
        }
        if (value === "0" && state.current === "0") {
          newState = state;
        }
        if (value === "." && state.current.includes(".")) {
          newState = state;
        } else if (state.negative == true && state.current == "-") {
          newState = {
            ...state,
            current: `-${value.num}`,
            negative: false,
          };
        } else {
          newState = {
            ...state,
            current: `${state.current || ""}${value.num}`,
          };
        }
        break;
      case OPERATION:
        if (
          state.current == null &&
          state.previous == null &&
          value.operation == "-"
        ) {
          newState = {
            ...state,
            negative: true,
            current: "-",
          };
          //3 * -2
        } else if (state.operation && value.operation == "-") {
          newState = {
            ...state,
            negative: true,
            current: "-",
          };
        } else if (state.current == null && state.previous == null) {
          newState = state;
        } else if (state.current == null) {
          newState = {
            ...state,
            operation: value.operation,
          };
        } else if (state.previous == null) {
          newState = {
            ...state,
            operation: value.operation,
            previous: state.current,
            current: null,
          };
        } else {
          newState = {
            ...state,
            previous: evaluate(state),
            operation: value.operation,
            current: null,
          };
        }
        break;
      case BACKSPACE:
        if (state.replace) {
          newState = {
            ...state,
            replace: false,
            current: null,
          };
        } else if (state.current == null) {
          newState = state;
        } else if (state.current.length === 1) {
          newState = {
            ...state,
            current: null,
          };
        } else {
          newState = {
            ...state,
            current: state.current.slice(0, -1),
          };
        }
        break;
      case OPEN_BRACKET:
        // 3 + 3(1+2)
        console.log("brackets are open");
        if (state.current && state.operation && state.previous) {
          newState = {
            ...state,
            outsideNum: evaluate(state),
            current: "(",
            operation: null,
            outsideOp: "*",
            inBrackets: true,
          };
          // 3 + (1 + 3)
        } else if (
          state.operation &&
          state.previous &&
          state.current === null
        ) {
          newState = {
            ...state,
            outsideOp: state.operation,
            outsideNum: state.previous,
            current: "(",
            previous: null,
            operation: null,
            inBrackets: true,
          };
          // (1 + 3)
        } else if (
          state.current === null &&
          state.previous === null &&
          state.operation === null
        ) {
          newState = {
            ...state,
            current: "(",
            inBrackets: true,
          };
          // null * (1 + 3)
        } else if (
          state.operation === "/" ||
          ("*" && state.previous === null && state.current === null)
        ) {
          newState = {
            ...state,
            operation: null,
            current: "(",
            inBrackets: true,
          };
          // 3 x^y (1 + 3)
        } else if (
          state.previous &&
          state.operation &&
          state.current === null
        ) {
          newState = {
            ...state,
            outsideOp: state.operation,
            outsideNum: state.previous,
            current: "(",
            previous: null,
            inBrackets: true,
          };
          // 3(1+3)
        } else if (
          state.current &&
          state.previous == null &&
          state.operation == null
        ) {
          newState = {
            ...state,
            outsideNum: state.current,
            current: "(",
            inBrackets: true,
          };
          // -(1 + 3)
        } else if (state.previous === null && state.operation === "-") {
          newState = {
            ...state,
            outsideOp: "-",
            current: "(",
            inBrackets: true,
          };
        }
        break;
      case CLOSE_BRACKET:
        // 3 + (1 + 3) ||  3 x^y (1 + 3)
        if (state.outsideOp && state.outsideNum) {
          newState = {
            ...state,
            previous: state.outsideNum,
            current: evaluate(state),
            operation: state.outsideOp,
            outsideNum: null,
            outsideOp: null,
            inBrackets: false,
          };
          // (1 + 3)
        } else if (state.outsideOp == null && state.outsideNum == null) {
          newState = {
            ...state,
            inBrackets: false,
          };
          // 3(3)
        } else if (
          state.outsideNum &&
          state.outsideOp == null &&
          state.previous == null
        ) {
          newState = {
            ...state,
            previous: state.outsideNum,
            current: state.current.slice(1),
            operation: "*",
            inBrackets: false,
            outsideNum: null,
          };
          // -(1 + 3)
        } else if (state.outsideNum == null && state.outsideOp == "-") {
          newState = {
            ...state,
            current: -Math.abs(evaluate(state)),
            inBrackets: false,
          };
          // 2(1+3)
        } else if (
          state.outsideNum &&
          state.outsideOp == null &&
          state.operation
        ) {
          newState = {
            ...state,
            current: state.current.slice(1),
            operation: "*",
            previous: state.outsideNum,
            outsideNum: null,
          };
        }
        break;
      case CLEAR:
        newState = initState;
        break;
      case TOTAL:
        if (state.negative == true) {
          newState = {
            ...state,
            previous: state.current,
            negative: false,
          };
        } else if (
          state.operation == null ||
          state.current == null ||
          state.previous == null
        ) {
          newState = state;
        } else {
          newState = {
            ...state,
            replace: true,
            prev: null,
            operation: null,
            current: evaluate(state),
          };
        }
        break;
      default:
        throw new Error();
    }
    return newState;
  }

  const [state, dispatch] = useReducer(calcReducer, initState);

  function evaluate(state) {
    let prev;
    if (state.previous.startsWith("(")) {
      prev = parseFloat(state.previous.slice(1));
    } else {
      prev = parseFloat(state.previous);
    }
    const curr = parseFloat(state.current);
    if (isNaN(prev) || isNaN(curr)) return "";
    let computation = "";
    switch (state.operation) {
      case "+":
        computation = prev + curr;
        break;
      case "-":
        computation = prev - curr;
        break;
      case "*":
        computation = prev * curr;
        break;
      case "/":
        computation = prev / curr;
        break;
      case "x^y":
        computation = prev ** curr;
    }
    if (computation.toString().includes(".")) {
      let decimals = computation.toString().split(".");
      computation =
        decimals.length > 14 ? Math.round(computation * 1000000) : computation;
    }
    return computation.toString();
  }

  console.log(state);

  return (
    <div className="calc--box">
      <div className="display">
        <div className="display--top">
          <div className="display--outside">
            {state.outsideNum}
            {state.outsideOp}
          </div>
          <div className="display--previous">
            {state.previous} {state.operation}
          </div>
        </div>
        <div className="display--current">{state.current}</div>
      </div>
      <div className="button--box">
        <button
          operation="AC"
          name="clear"
          onClick={() => dispatch({ type: CLEAR })}
          className="button operator clear other"
        >
          AC
        </button>
        <button
          operation="Del"
          name="backspace"
          className="button operator backspace other"
          onClick={() => dispatch({ type: BACKSPACE })}
        >
          Del
        </button>
        <OperationButton operation="x^y" name="exponent" dispatch={dispatch} />
        <OperationButton operation="+" name="add" dispatch={dispatch} />
        <button
          operation="("
          name="openBracket"
          className="button operator other"
          onClick={() => dispatch({ type: OPEN_BRACKET })}
          disabled={state.inBrackets}
        >
          (
        </button>
        <NumButton dispatch={dispatch} num={"7"} />
        <NumButton dispatch={dispatch} num={"8"} />
        <NumButton dispatch={dispatch} num={"9"} />
        <OperationButton operation="-" name="subtract" dispatch={dispatch} />
        <button
          operation=")"
          name="closeBracket"
          className="button operator other"
          onClick={() => dispatch({ type: CLOSE_BRACKET })}
          disabled={!state.inBrackets}
        >
          )
        </button>
        <NumButton dispatch={dispatch} num={"4"} />
        <NumButton dispatch={dispatch} num={"5"} />
        <NumButton dispatch={dispatch} num={"6"} />
        <OperationButton operation="/" name="divide" dispatch={dispatch} />
        <NumButton num="." dispatch={dispatch} name="decimal" />
        <NumButton dispatch={dispatch} num={"1"} />
        <NumButton dispatch={dispatch} num={"2"} />
        <NumButton dispatch={dispatch} num={"3"} />
        <OperationButton operation="*" name="multiply" dispatch={dispatch} />
        <NumButton dispatch={dispatch} num={"0"} />
        <OperationButton operation="=" name="equals" dispatch={dispatch} />
      </div>
    </div>
  );
}
