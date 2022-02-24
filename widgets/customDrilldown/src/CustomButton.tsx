import type { FunctionComponent } from 'react';

interface ButtonInterface {
    label?: string;
    onClick: (events: React.MouseEvent<HTMLElement>) => void;
    icon?: string;
}

const CustomButton: FunctionComponent<ButtonInterface> = ({ label, onClick, icon }) => {
    let { Button } = Stage.Basic;

    return (
        <Button className="btn" onClick={onClick} basic={false} label={label} icon={icon} />
    );
};

export default CustomButton;
