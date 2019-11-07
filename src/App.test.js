import React from 'react';
import ReactDOM from 'react-dom';
import {App,
		isValidInput,
		numberHasMoreThanOneDecimal,
		isValidExpression} from './App';
import renderer from 'react-test-renderer';
import { render, fireEvent,cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

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

//UI tests

afterEach(cleanup);

it('should handle button input correctly', () => {
	const {getByText,getByTestId} = render(<App />);

	fireEvent.click(getByText('1'))
	expect(getByTestId('calc-display')).toHaveValue('1')
	
	fireEvent.click(getByText('2'))
	expect(getByTestId('calc-display')).toHaveValue('12')
	
	fireEvent.click(getByText('+'))
	expect(getByTestId('calc-display')).toHaveValue('12+')
	
	fireEvent.click(getByText('+'))
	expect(getByTestId('calc-display')).toHaveValue('12+')
	
	//should be invalid
	fireEvent.click(getByText('='))
	expect(getByTestId('calc-display')).toHaveValue('12+')
	
	fireEvent.click(getByText('3'))
	expect(getByTestId('calc-display')).toHaveValue('12+3')

	fireEvent.click(getByText('='))
	expect(getByTestId('calc-display')).toHaveValue('15')

	fireEvent.click(getByText('.'))
	expect(getByTestId('calc-display')).toHaveValue('15.')
	
	//should be invalid
	fireEvent.click(getByText('.'))
	expect(getByTestId('calc-display')).toHaveValue('15.')

	fireEvent.click(getByText('4'))
	expect(getByTestId('calc-display')).toHaveValue('15.4')

	fireEvent.click(getByText('⬅'))
	expect(getByTestId('calc-display')).toHaveValue('15.')

	fireEvent.click(getByText('C'))
	expect(getByTestId('calc-display')).toHaveValue('0')
});

it('should handle keyboard input correctly', () => {
	const {getByText,getByTestId} = render(<App />);

	fireEvent.keyUp(document.querySelector('body'), { key: '1'})
	expect(getByTestId('calc-display')).toHaveValue('1')
	
	fireEvent.keyUp(document.querySelector('body'), { key: '2'})
	expect(getByTestId('calc-display')).toHaveValue('12')
	
	fireEvent.keyUp(document.querySelector('body'), { key: '+'})
	expect(getByTestId('calc-display')).toHaveValue('12+')
	
	fireEvent.keyUp(document.querySelector('body'), { key: '+'})
	expect(getByTestId('calc-display')).toHaveValue('12+')
	
	//should be invalid
	fireEvent.keyUp(document.querySelector('body'), { key: '='})
	expect(getByTestId('calc-display')).toHaveValue('12+')
	
	fireEvent.keyUp(document.querySelector('body'), { key: '3'})
	expect(getByTestId('calc-display')).toHaveValue('12+3')

	fireEvent.keyUp(document.querySelector('body'), { key: '='})
	expect(getByTestId('calc-display')).toHaveValue('15')

	fireEvent.keyUp(document.querySelector('body'), { key: '.'})
	expect(getByTestId('calc-display')).toHaveValue('15.')
	
	//should be invalid
	fireEvent.keyUp(document.querySelector('body'), { key: '.'})
	expect(getByTestId('calc-display')).toHaveValue('15.')

	fireEvent.keyUp(document.querySelector('body'), { key: '4'})
	expect(getByTestId('calc-display')).toHaveValue('15.4')

	fireEvent.keyUp(document.querySelector('body'), { key: 'Backspace'})
	expect(getByTestId('calc-display')).toHaveValue('15.')
});

it('should return correct answer for all operations', () => {
	const {getByText,getByTestId} = render(<App />);

	fireEvent.click(getByText('1'))
	fireEvent.click(getByText('+'))
	fireEvent.click(getByText('1'))
	fireEvent.click(getByText('='))
	expect(getByTestId('calc-display')).toHaveValue('2')
	fireEvent.click(getByText('C'))

	fireEvent.click(getByText('1'))
	fireEvent.click(getByText('-'))
	fireEvent.click(getByText('1'))
	fireEvent.click(getByText('='))
	expect(getByTestId('calc-display')).toHaveValue('0')
	fireEvent.click(getByText('C'))

	fireEvent.click(getByText('2'))
	fireEvent.click(getByText('*'))
	fireEvent.click(getByText('2'))
	fireEvent.click(getByText('='))
	expect(getByTestId('calc-display')).toHaveValue('4')
	fireEvent.click(getByText('C'))

	fireEvent.click(getByText('2'))
	fireEvent.click(getByText('/'))
	fireEvent.click(getByText('2'))
	fireEvent.click(getByText('='))
	expect(getByTestId('calc-display')).toHaveValue('1')
})

it('should store a number in memory when M is pressed and recalled when MR is pressed', () => {
	const {getByText,getByTestId} = render(<App />);

	fireEvent.click(getByText('1'))
	fireEvent.click(getByText('M'))
	fireEvent.click(getByText('C'))
	fireEvent.click(getByText('MR'))
	expect(getByTestId('calc-display')).toHaveValue('1')
	fireEvent.click(getByText('MR'))
	expect(getByTestId('calc-display')).toHaveValue('11')
})
