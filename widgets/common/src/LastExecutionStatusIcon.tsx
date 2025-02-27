// @ts-nocheck File not migrated fully to TS

const t = Stage.Utils.getT('widgets.common.executions');

export default class LastExecutionStatusIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            errorModalOpen: false,
            updateModalOpen: false,
            open: false
        };

        this.actOnExecution = this.actOnExecution.bind(this);
        this.showLogs = this.showLogs.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    showLogs() {
        const { execution, toolbox } = this.props;

        toolbox.drillDown(
            toolbox.getWidget(),
            'logs',
            { deploymentId: execution.deployment_id, executionId: execution.id },
            `Execution Logs - ${execution.id}`
        );
    }

    actOnExecution(execution, action) {
        const { onActOnExecution, toolbox } = this.props;
        const actions = new Stage.Common.ExecutionActions(toolbox);
        actions
            .doAct(execution, action)
            .then(() => {
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
                onActOnExecution(execution, action, null);
            })
            .catch(err => {
                onActOnExecution(execution, action, err.message);
            });
    }

    render() {
        const { errorModalOpen, open, updateModalOpen } = this.state;
        const { labelAttached, execution: executionProp, showLabel, toolbox } = this.props;
        const { CancelButton, Button, CopyToClipboardButton, HighlightText, Icon, Table, Modal, Popup } = Stage.Basic;
        const { UpdateDetailsModal } = Stage.Common;
        const { ExecutionStatus } = Stage.Shared;
        const { Utils } = Stage;
        const execution = { workflow_id: '', status: '', ...executionProp };

        const showScheduledColumn = !!execution.scheduled_for;
        const colSpan = showScheduledColumn ? 5 : 4;

        return !_.isEmpty(execution.status) ? (
            <>
                <Popup
                    wide="very"
                    on="hover"
                    hoverable
                    open={open}
                    onOpen={() => this.setState({ open: true })}
                    onClose={() => this.setState({ open: false })}
                    onClick={e => {
                        e.stopPropagation();
                        this.setState({ open: false });
                    }}
                >
                    <Popup.Trigger>
                        <div style={{ display: 'inline-block' }}>
                            <ExecutionStatus
                                execution={execution}
                                allowShowingPopup={false}
                                showLabel={showLabel}
                                showWorkflowId={showLabel}
                                labelAttached={labelAttached ? 'top left' : undefined}
                                iconAttached={showLabel ? undefined : 'top left'}
                                iconSize="large"
                            />
                        </div>
                    </Popup.Trigger>

                    <Popup.Header>Last Execution</Popup.Header>

                    <Popup.Content>
                        <Table compact celled>
                            <Table.Header>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell>Workflow</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                    <Table.HeaderCell>Created</Table.HeaderCell>
                                    {showScheduledColumn && <Table.HeaderCell>Scheduled</Table.HeaderCell>}
                                    <Table.HeaderCell>Ended</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row textAlign="center">
                                    <Table.Cell>{execution.workflow_id}</Table.Cell>
                                    <Table.Cell>{execution.status_display || execution.status}</Table.Cell>
                                    <Table.Cell>{Stage.Utils.Time.formatTimestamp(execution.created_at)}</Table.Cell>
                                    {showScheduledColumn && (
                                        <Table.Cell>
                                            {Stage.Utils.Time.formatTimestamp(execution.scheduled_for)}
                                        </Table.Cell>
                                    )}
                                    <Table.Cell>{Stage.Utils.Time.formatTimestamp(execution.ended_at)}</Table.Cell>
                                </Table.Row>
                            </Table.Body>

                            <Table.Footer fullWidth>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell colSpan={colSpan}>
                                        {Utils.Execution.isFailedExecution(execution) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() => this.setState({ errorModalOpen: true })}
                                            >
                                                <Icon name="remove" />
                                                Show Error
                                            </Button>
                                        )}
                                        <Button icon color="teal" labelPosition="left" onClick={this.showLogs}>
                                            <Icon name="file text" />
                                            Show Logs
                                        </Button>
                                        {Utils.Execution.isUpdateExecution(execution) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() => this.setState({ updateModalOpen: true })}
                                            >
                                                <Icon name="magnify" />
                                                Show Update Details
                                            </Button>
                                        )}
                                    </Table.HeaderCell>
                                </Table.Row>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell colSpan={colSpan}>
                                        {(Utils.Execution.isCancelledExecution(execution) ||
                                            Utils.Execution.isFailedExecution(execution)) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() =>
                                                    this.actOnExecution(execution, Utils.Execution.FORCE_RESUME_ACTION)
                                                }
                                            >
                                                <Icon name="play" />
                                                Resume
                                            </Button>
                                        )}
                                        {(Utils.Execution.isActiveExecution(execution) ||
                                            Utils.Execution.isWaitingExecution(execution)) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() =>
                                                    this.actOnExecution(execution, Utils.Execution.CANCEL_ACTION)
                                                }
                                            >
                                                <Icon name="cancel" />
                                                Cancel
                                            </Button>
                                        )}
                                        {(Utils.Execution.isActiveExecution(execution) ||
                                            Utils.Execution.isWaitingExecution(execution)) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() =>
                                                    this.actOnExecution(execution, Utils.Execution.FORCE_CANCEL_ACTION)
                                                }
                                            >
                                                <Icon name="cancel" />
                                                Force Cancel
                                            </Button>
                                        )}
                                        <Button
                                            icon
                                            color="teal"
                                            labelPosition="left"
                                            onClick={() =>
                                                this.actOnExecution(execution, Utils.Execution.KILL_CANCEL_ACTION)
                                            }
                                        >
                                            <Icon name="stop" />
                                            Kill Cancel
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Popup.Content>
                </Popup>
                {Utils.Execution.isFailedExecution(execution) && (
                    <Modal open={errorModalOpen} onClose={() => this.setState({ errorModalOpen: false })}>
                        <Modal.Header>
                            Error message from &apos;{execution.workflow_id}&apos; worfklow execution on &apos;
                            {execution.deployment_id}&apos; deployment
                        </Modal.Header>
                        <Modal.Content>
                            <HighlightText>{execution.error || t('noErrorDetails')}</HighlightText>
                        </Modal.Content>
                        <Modal.Actions>
                            <CopyToClipboardButton content="Copy Error" text={execution.error} />
                            <CancelButton
                                onClick={e => {
                                    e.stopPropagation();
                                    this.setState({ errorModalOpen: false });
                                }}
                                content="Close"
                            />
                        </Modal.Actions>
                    </Modal>
                )}
                {Utils.Execution.isUpdateExecution(execution) && (
                    <UpdateDetailsModal
                        open={updateModalOpen}
                        deploymentUpdateId={_.get(execution, 'parameters.update_id')}
                        onClose={() => this.setState({ updateModalOpen: false })}
                        toolbox={toolbox}
                    />
                )}
            </>
        ) : null;
    }
}

LastExecutionStatusIcon.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    execution: PropTypes.shape({
        created_at: PropTypes.string,
        deployment_id: PropTypes.string,
        ended_at: PropTypes.string,
        error: PropTypes.string,
        id: PropTypes.string,
        scheduled_for: PropTypes.string,
        status_display: PropTypes.string,
        workflow_id: '',
        status: ''
    }),
    onActOnExecution: PropTypes.func,
    showLabel: PropTypes.bool,
    labelAttached: PropTypes.bool
};

LastExecutionStatusIcon.defaultProps = {
    execution: { workflow_id: '', status: '' },
    onActOnExecution: _.noop,
    showLabel: false,
    labelAttached: true
};

Stage.defineCommon({
    name: 'LastExecutionStatusIcon',
    common: LastExecutionStatusIcon
});
