import React from 'react'
import { ACTIONS } from './App'

export default function OperationButton(props){
  const { operation, name, className, dispatch } = props
  const { OPERATION } = ACTIONS

  // function namedOperation(item){
  //   if (item === "x^y"){
  //     return "exponent"
  //   } else if (item === "="){
  //     return "equals"
  //   } else if (["+" , "-" , "*" , "/"].find(symbol => item === symbol)) {
  //     return "action"
  //   } else {
  //     return "other"
  //   }

  return (
    <button className={`button operator ${name} ${className}`} onClick={() => dispatch({type: OPERATION ,value: {operation}})}>
      {operation}
    </button>
  )
}