import type { FunctionComponent } from 'react';

interface ButtonInterface {
    label: string;
    onClick: (events: React.MouseEvent<HTMLElement>) => void;
}

const Button: FunctionComponent<ButtonInterface> = ({ label, onClick }) => {
    // let { Button } = Stage.Basic;

    return (
        // <Button className="btn" onClick={onClick} basic={false} label={label} />
        <button type="button" className="btn" onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;
