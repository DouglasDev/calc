import React from 'react';
import ReactDOM from 'react-dom';
import {App,
		isValidInput,
		numberHasMoreThanOneDecimal,
		isValidExpression} from './App';
import renderer from 'react-test-renderer';

//Unit tests
test('numbers are always valid input', () => {
	expect(isValidInput('','1')).toBe(true);
	expect(isValidInput('1','1')).toBe(true);
	expect(isValidInput('-100','1')).toBe(true);
});
test('a symbol is valid if the previous input is a number', () => {
	expect(isValidInput('1','+')).toBe(true);
	expect(isValidInput('1+1','*')).toBe(true);
	expect(isValidInput('-','+')).toBe(false);
	expect(isValidInput('/','*')).toBe(false);
});
test('a negative sign is valid if not following another negative sign', () => {
	expect(isValidInput('','-')).toBe(true);
	expect(isValidInput('1','-')).toBe(true);
	expect(isValidInput('-','-')).toBe(false);
	expect(isValidInput('1-','-')).toBe(false);
});
test('all other input is invalid', () => {
	expect(isValidInput('','qwerty')).toBe(false);
	expect(isValidInput('','-+')).toBe(false);
	expect(isValidInput('','\*')).toBe(false);
});

test('1..1 , .1. and 1.1.1 all have more than one decimal', () => {
	expect(numberHasMoreThanOneDecimal('1..1')).toBe(true);
	expect(numberHasMoreThanOneDecimal('.1.')).toBe(true);
	expect(numberHasMoreThanOneDecimal('1.1.1')).toBe(true);
});

test('1.1 , .1 and 1. all have one decimal', () => {
	expect(numberHasMoreThanOneDecimal('1.1')).toBe(false);
	expect(numberHasMoreThanOneDecimal('.1')).toBe(false);
	expect(numberHasMoreThanOneDecimal('1.')).toBe(false);
});

test('expressions not ending with a mathematical symbol are valid', () => {
	expect(isValidExpression('1+1')).toBe(true);
	expect(isValidExpression('1+2-3/4*5')).toBe(true);
});

test('expressions ending with a mathematical symbol are invalid', () => {
	expect(isValidExpression('1+1+')).toBe(false);
	expect(isValidExpression('1+2-3/4*5*')).toBe(false);
});

//Component tests


// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });
