import React from 'react'
import { ACTIONS } from './App'


export default function NumButton(props){
  const { INPUT_DIGIT } = ACTIONS
  const {dispatch, num, name } = props
  return (
    <button className={`button num ${name}`} onClick={() => dispatch({type: INPUT_DIGIT, value: {num}}) }>
      {num}
    </button>
  )
}