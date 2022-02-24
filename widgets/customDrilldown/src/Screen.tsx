import type { FunctionComponent } from 'react';

interface ScreenInterface {
    theValue1: number;
    theValue2: number;
    theOperation: string;
    theResult: number;
}

const Screen: FunctionComponent<ScreenInterface> = ({ theValue1, theValue2, theOperation, theResult }) => (
    <div>
        <h2 className="screen">
            {theValue1} {theOperation} {theValue2} = {theResult}
        </h2>
    </div>
);

export default Screen;
