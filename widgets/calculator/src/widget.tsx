// @ts-nocheck File not migrated fully to TS

import Button from './Button';
import Screen from './Screen';

let theValue1 = 0;
let theValue2 = 0;
let theResult = 0;

const setValues = (value: number) => {
    if (theValue1 === 0) theValue1 = value;
    else theValue2 = value;
};

const clear = () => {
    theValue1 = 0;
    theValue2 = 0;
    theResult = 0;
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
    theResult = result;
    return theResult;
};

Stage.defineWidget({
    id: 'calculator',
    name: '@Simple Calculator',
    description: 'This is a sample widget for widget writing boilerplate',
    initialWidth: 12,
    initialHeight: 8,
    color: 'green',
    isReact: true,
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
    categories: [Stage.GenericConfig.CATEGORY.OTHERS],

    render(widget, data, error, toolbox) {
        return (
            <div>
                <Screen theValue1={theValue1} theValue2={theValue2} theResult={theResult} theOperation="+" />
                <Button label="1" onClick={() => setValues(1)} />
                <Button label="2" onClick={() => setValues(2)} />
                <Button label="3" onClick={() => setValues(3)} />
                <Button label="Clear" onClick={() => clear()} />
                <Button label="Calculate" onClick={() => calculate('+', theValue1, theValue2)} />
            </div>
        );
    }
});
