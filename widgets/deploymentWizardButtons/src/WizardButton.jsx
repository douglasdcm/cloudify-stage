/**
 * Created by jakub.niezgoda on 13/08/2018.
 */

import Wizard from './wizard';

export default class WizardButton extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false
        };
    }

    openWizard(event) {
        event.stopPropagation();
        this.setState({ open: true });
    }

    closeWizard() {
        this.setState({ open: false });
    }

    render() {
        const { Button, Icon } = Stage.Basic;
        const { color, icon, name, steps, toolbox, wizardTitle } = this.props;
        const { open } = this.state;

        return (
            <>
                <Button
                    color={color}
                    onClick={this.openWizard.bind(this)}
                    labelPosition="left"
                    icon
                    className="widgetButton"
                >
                    <Icon name={icon} size="large" />
                    {name}
                </Button>
                {open && <Wizard.Modal
                    header={wizardTitle}
                    steps={steps}
                    onClose={this.closeWizard.bind(this)}
                    toolbox={toolbox}
                />}
            </>
        );
    }
}

WizardButton.propTypes = {
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    wizardTitle: PropTypes.string.isRequired,
    steps: Wizard.Modal.StepsPropType.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};