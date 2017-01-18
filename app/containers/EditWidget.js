/**
 * Created by addihorowitz on 10/06/2016.
 */


import React from 'react';
import { connect } from 'react-redux'
import EditWidgetIcon from '../components/EditWidgetIcon';
import {editWidget} from '../actions/widgets';
import EditWidgetModal from '../components/EditWidgetModal';

const mapStateToProps = (state, ownProps) => {
    return {
        pageId: ownProps.pageId,
        widget: ownProps.widget,
        configuration: ownProps.widget.configuration || {},
        configDef: ownProps.widget.plugin.initialConfiguration || [],
        showConfig: ownProps.widget.showConfig || false
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onWidgetEdited: (configuration) => {
            dispatch(editWidget(ownProps.pageId, ownProps.widget.id, configuration || ownProps.widget.configuration || {}));
        }
    }
};

class EditWidgetComponent extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showConfig: false
        }
    }

    static propTypes = {
        widget : React.PropTypes.object,
        onWidgetEdited : React.PropTypes.func,
        configDef : React.PropTypes.array,
        configuration : React.PropTypes.object
    };

    _showConfig() {
        this.setState({showConfig:true});
    }

    _hideConfig() {
        this.setState({showConfig:false});
    }

    render() {
        return (
            <span>
                <EditWidgetIcon widgetId={this.props.widget.id} onShowConfig={this._showConfig.bind(this)}/>
                <EditWidgetModal widget={this.props.widget} configDef={this.props.configDef} configuration={this.props.configuration}
                                 onWidgetEdited={this.props.onWidgetEdited} show={this.state.showConfig} onHideConfig={this._hideConfig.bind(this)}/>
            </span>
        );
    }
}

const EditWidget = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditWidgetComponent);


export default EditWidget