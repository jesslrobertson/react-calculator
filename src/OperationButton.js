import React from 'react'
import { ACTIONS } from './App'

export default function OperationButton(props){
  const { operation, name, className, dispatch } = props
  const { OPERATION } = ACTIONS

  return (
    <button className={`button operator ${name} ${className}`} onClick={() => dispatch({type: OPERATION ,value: {operation}})}>
      {operation}
    </button>
  )
}