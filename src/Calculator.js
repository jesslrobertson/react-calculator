import React, { useReducer } from "react";
import NumButton from "./NumButton";
import OperationButton from "./OperationButton";
import { ACTIONS } from "./App";

export default function Calculator() {
  // const ACTIONS = {
  //   INPUT_DIGIT: "input",
  //   CLEAR: "clear",
  //   BACKSPACE: "backspace",
  //   OPERATION: "operation",
  //   TOTAL: "total",
  // };

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
  };

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
        } else if (state.negative === true) {
          newState = {
            ...state,
            current: -Math.abs(Number(value.num)),
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
          console.log("we have a negative int!");
          newState = {
            ...state,
            negative: true,
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
      case OPEN_BRACKET:
        // 3 + 3(1+2)
        if (state.current && state.operation && state.previous) {
          newState = {
            ...state,
            outsideNum: evaluate(state),
            current: null,
            operation: null,
            outsideOp: "*",
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
            previous: null,
            operation: null,
          };
          // (1 + 3)
        } else if (
          state.current === null &&
          state.previous === null &&
          state.operation === null
        ) {
          newState = {
            ...state,
          };
          // null * (1 + 3)
        } else if (
          state.operation === "/" ||
          ("*" && state.previous === null && state.current === null)
        ) {
          newState = {
            ...state,
            operation: null,
          };
          // 3 x^y (1 + 3) || 3(1+3)
        } else if (
          state.previous &&
          state.operation &&
          state.current === null
        ) {
          newState = {
            ...state,
            outsideOp: state.operation,
            outsideNum: state.previous,
            previous: null,
          };
          // -(1 + 3)
        } else if (state.previous === null && state.operation === "-") {
          newState = {
            ...state,
            outsideOp: "-",
          };
        }
        break;
      case CLOSE_BRACKET:
      // 3 + (1 + 3)
      // (1 + 3)
      // 3 x^y (1 + 3) || 3(1+3)
      // -(1 + 3)
      case CLEAR:
        newState = initState;
        break;
      case TOTAL:
        if (
          state.operation == null ||
          state.current == null ||
          state.previous == null
        ) {
          newState = state;
        } else if (
          (state.operation == null && state.previous == null) ||
          Number(state.current) < 0
        ) {
          newState = {
            ...state,
            previous: state.current,
          };
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
    const prev = parseFloat(state.previous);
    const curr = parseFloat(state.current);
    if (isNaN(prev) || isNaN(curr)) return "";
    if (isNaN(prev) && curr < 0) return curr.toString();
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
    return computation.toString();
  }

  const Formatter = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
  });

  function formatOp(value) {
    if (value == null) return;
    const [integer, decimal] = value.split(".");
    if (decimal == null) return Formatter.format(integer);
    return `${Formatter.format(integer)}.${decimal}`;
  }

  console.log(state);

  return (
    <div className="calc--box">
      <div className="display">
        <div className="display--previous">
          {formatOp(state.previous)} {state.operation}
        </div>
        <div className="display--current">{formatOp(state.current)}</div>
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
        <OperationButton
          operation="("
          name="openParenthesis"
          className="other"
        />
        <NumButton dispatch={dispatch} num={"7"} />
        <NumButton dispatch={dispatch} num={"8"} />
        <NumButton dispatch={dispatch} num={"9"} />
        <OperationButton operation="-" name="subtract" dispatch={dispatch} />
        <OperationButton
          operation=")"
          name="closedParenthesis"
          className="other"
        />
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
