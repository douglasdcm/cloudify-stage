/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props, context);

        this.state = {...CreateModal.initialState, show: false}
    }

    static initialState = {
        loading: false,
        snapshotId: "",
        includeMetrics: false,
        includeCredentials: false,
        errors: {}
    }

    onApprove () {
        this.refs.createForm.submit();
        return false;
    }

    onDeny () {
        this.setState({show: false});
        return true;
    }

    _showModal() {
        this.setState({show: true});
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.show && this.state.show) {
            this.setState(CreateModal.initialState);
        }
    }

    _submitCreate() {
        let errors = {};

        if (_.isEmpty(this.state.snapshotId)) {
            errors["snapshotId"]="Please provide snapshot id";
        } else {
            const URL_SAFE_CHARACTERS_RE = /^[0-9a-zA-Z\$\-\_\.\+\!\*\'\(\)\,]+$/;
            if (!URL_SAFE_CHARACTERS_RE.test(this.state.snapshotId)) {
                errors["snapshotId"] = "Please use safe characters. Letters, digits and the following " +
                                       "special characters $-_.+!*'(), are allowed";
            }
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        // Call create method
        var actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.snapshotId, this.state.includeMetrics, this.state.includeCredentials).then(()=>{
            this.props.toolbox.getContext().setValue(this.props.widget.id + 'createSnapshot',null);
            this.props.toolbox.getEventBus().trigger('snapshots:refresh');
            this.setState({loading: false, show: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form} = Stage.Basic;

        return (
            <div>
                <Button content='Create' icon='add' labelPosition='left' onClick={this._showModal.bind(this)}/>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <Icon name="add"/> Create snapshot
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this._submitCreate.bind(this)} errors={this.state.errors} ref="createForm">

                            <Form.Field error={this.state.errors.snapshotId}>
                                <Form.Input name='snapshotId' placeholder="Snapshot ID"
                                            value={this.state.snapshotId} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Checkbox label="Include metrics stored in InfluxDB" name="includeMetrics"
                                               checked={this.state.includeMetrics} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Checkbox label="Include agent SSH keys (including those specified in uploaded blueprints)" name="includeCredentials"
                                               checked={this.state.includeCredentials} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Create" icon="add" className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};
