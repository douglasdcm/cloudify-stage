// @ts-nocheck File not migrated fully to TS

import CustomGrid from './CustomGrid'
import type { FunctionComponent } from 'react';


function CalculatorFunc() {

  return (
    <div className="App">
      <CustomGrid />
    </div>
  );


}

const Calculator: FunctionComponent = () => {
  return <CalculatorFunc />
};

export default Calculator;