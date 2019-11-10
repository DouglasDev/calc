import React, { useState,useEffect } from 'react';
import './paper.min.css';
import './App.css';

const numbers=['1','2','3','4','5','6','7','8','9','0'],
      symbols=['-','+','/','*']

export function isValidInput(expression,input){
  //valid input can be: a number, 
  //a symbol if the previous input is a number, 
  //a negative sign not following another negative sign, 
  //and there cannot be more than one decimal point per number
  if (numbers.includes(input)) return true
  else if (symbols.includes(input) && numbers.includes(expression.slice(-1))) return true
  else if (input==='-' && expression.slice(-1)!=='-') return true
  else if (input==='.' && !numberHasMoreThanOneDecimal(expression+input)) return true
  return false
}

export function numberHasMoreThanOneDecimal(input){
  //find two decimal points separated by 0 or more numbers
  return input.match(/\.\d*\./)!==null
}

export function isValidExpression(expression){
  //we validated input but still need to handle the case of an expression that ends in a symbol being invalid
  return symbols.includes(expression.slice(-1)) ? false : true
}

export function App() {
  const [memory,setMemory]= useState(''),
        [expression,setExpression]= useState('')

  useEffect(()=>{
    const handleKeyUp = event => {
      const { key } = event;
      if (key==="Enter"|| key==="=") displayResults()
      else if (key==="Backspace") deleteLast()
      else enterInput(String(key))    
    }
  
    window.addEventListener('keyup',handleKeyUp)
    return ()=>window.removeEventListener('keyup',handleKeyUp)
  },[])

  function deleteLast(){
    setExpression(expression=>expression.slice(0,expression.length-1))
  }

  function displayResults(){
    setExpression(expression=>{
      if (!expression) return ''
      else if (isValidExpression(expression)) return String((Function('return '+expression))())
    })
  }

  function enterInput(input){
    setExpression(expression=>{
      if (isValidInput(expression,input)) return expression+input
      else return expression
    })
    //this prevents the enter key from triggering button presses unintentionally, 
    //since we allow input through mouse clicks and keyboard
    document.activeElement.blur();
  }

  return (
    <div className="App">
      <h1 className="text-primary">Simple Calc</h1>

      <main className='calc-main card'>
        <input data-testid="calc-display" readOnly type="text" value={expression.length ? expression : '0'} />

        <div className='card-body'>
          <div className='keypad'>
            <button onClick={()=>setExpression('')}>C</button>
            <button onClick={deleteLast}>⬅</button>
            <button onClick={()=>setMemory(expression)}>M</button>
            <button onClick={()=>setExpression(expression+memory)}>MR</button>
            {[...symbols,...numbers].map(val => 
              <button key={val} onClick={()=>enterInput(val)}>
                {val}
              </button>
            )}
            <button onClick={()=>enterInput('.')}>.</button>
            <button onClick={displayResults}>=</button>
          </div>
        </div>
      </main>
      <h3 className="text-primary">By Douglas Lerner</h3>
    </div>
  );
}