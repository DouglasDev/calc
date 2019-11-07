import React, { useState,useEffect } from 'react';
import './paper.min.css';
import './App.css';


function App() {

  const [memory,setMemory]= useState(''),
    [expression,setExpression]= useState(''),
    numbers=['1','2','3','4','5','6','7','8','9','0'],
    symbols=['-','+','/','*']

  useEffect(()=>{
    console.log('memory',memory,'expression',expression)
  })


  function isValidInput(expression,input){
    //valid input can be: a number, or a symbol if the previous input is a number, or a negative sign, 
    //and cannot have more than one decimal point per number
    if (numbers.includes(input)) return true
    else if (symbols.includes(input) && numbers.includes(expression.slice(-1))) return true
    else if (input==='-' && symbols.includes(expression.slice(-1))) return true
    else if (input==='.' && !numberHasMoreThanOneDecimal(expression+input)) return true
    return false
  }

  function numberHasMoreThanOneDecimal(input){
    //find two decimal points separated by 0 or more numbers
    return input.match(/\.\d*\./)
  }

  function isValidExpression(expression){
    //we validated input but still need to handle the case of an invalid expression that ends in a symbol
    return symbols.includes(expression.slice(-1)) ? false : true
  }

  function deleteLast(){
    setExpression(expression.slice(0,expression.length-1))
  }

  function displayResults(){
    if (!expression) setExpression('')
    else if (isValidExpression(expression)) setExpression(String((new Function('return '+expression))()));
  }

  function enterInput(input){
    if (isValidInput(expression,input)) setExpression(expression+input)
  }

  return (
    <div className="App">
      <main className='calc-main card'>
        <input readOnly type="text" value={expression.length ? expression : '0'} />

        <div className='calc-buttons card-body'>
          <div className='keypad'>
            <button onClick={()=>setExpression('')}>C</button>
            <button onClick={deleteLast}>⬅</button>
            <button onClick={()=>setMemory(expression)}>M</button>
            <button onClick={()=>setExpression(expression+memory)}>MR</button>
            <div className="break"></div>
            {symbols.map(val => 
              <button key={val} onClick={()=>enterInput(val)}>
                {val}
              </button>
            )}
            {numbers.map(val => 
              <button key={val} onClick={()=>enterInput(val)}>
                {val}
              </button>
            )}
            <button onClick={()=>enterInput('.')}>.</button>
            <button onClick={displayResults}>=</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;