// @ts-nocheck File not migrated fully to TS

import { useState } from 'react';
import type { FunctionComponent } from 'react';
import Button from './Button';
import Screen from './Screen';
import Header from './Header';
import ButtonGroup from './ButtonGroup';


function CalculatorFunc() {

    const [theValue1, setValue1] = useState(0);
    const [theValue2, setValue2] = useState(0);
    const [theResult, setResult] = useState(0);
    const [theOperation, setOperation] = useState('+')

    const setValues = (value: number) => {
        if (theValue1 === 0) {
            setValue1(value)
        }
        else {
            setValue2(value)
        }
    }

    const clear = () => {
        setValue1(0)
        setValue2(0)
        setResult(0)
    };

    const calculate = (operation: string, value1: number, value2: number) => {
        let result = 0;
        if (operation === '+') {
            result = value1 + value2;
        }
        if (operation === '*') {
            result = value1 * value2;
        }
        if (operation === '-') {
            result = value1 - value2;
        }
        if (operation === '/') {
            result = value1 / value2;
        }
        setResult(result)
        return theResult;
    };

    return (
        <div className="App">
      <Header title='This is a simple calculator' />
      <Screen
        theValue1={theValue1}
        theValue2={theValue2}
        theOperation={theOperation}
        theResult={theResult} />
      <ButtonGroup buttons={[
        <Button label='0' onClick={() => setValues(0)} />,
        <Button label='1' onClick={() => setValues(1)} />,
        <Button label='2' onClick={() => setValues(2)} />
      ]
      }
      />
      <ButtonGroup buttons={[
        <Button label='3' onClick={() => setValues(3)} />,
        <Button label='4' onClick={() => setValues(4)} />,
        <Button label='5' onClick={() => setValues(5)} />
      ]
      }
      />
      <ButtonGroup buttons={[
        <Button label='6' onClick={() => setValues(6)} />,
        <Button label='7' onClick={() => setValues(7)} />,
        <Button label='8' onClick={() => setValues(8)} />
      ]
      }
      />
      <ButtonGroup buttons={[
        <Button label='9' onClick={() => setValues(9)} />,
        <Button label='+' onClick={() => setOperation('+')} />,
        <Button label='-' onClick={() => setOperation('-')} />
      ]
      }
      />
      
      <ButtonGroup buttons={[
        <Button label='c' onClick={() => clear()} />,
        <Button label='*' onClick={() => setOperation('*')} />,
        <Button label='/' onClick={() => setOperation('/')} />,
      ]
      }
      />
      <Button label='=' onClick={() => calculate(theOperation, theValue1, theValue2)} />
    </div>
    );

    
}

const Calculator: FunctionComponent = () => {
    return <CalculatorFunc />
};

export default Calculator;