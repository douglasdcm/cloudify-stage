// @ts-nocheck File not migrated fully to TS

import DeploymentsList from './DeploymentsList';

Stage.defineWidget({
    id: 'deployments',
    name: 'Blueprint deployments',
    description: 'Shows blueprint deployments list',
    initialWidth: 8,
    initialHeight: 24,
    color: 'purple',
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {
            id: 'clickToDrillDown',
            name: 'Enable click to drill down',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showExecutionStatusLabel',
            name: 'Show execution status label',
            description: 'Show last execution workflow ID and status',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'blueprintIdFilter',
            name: 'Blueprint ID to filter by',
            placeHolder: 'Enter the blueprint id you wish to filter by',
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'displayStyle',
            name: 'Display style',
            items: [
                { name: 'Table', value: 'table' },
                { name: 'List', value: 'list' }
            ],
            default: 'table',
            type: Stage.Basic.GenericField.LIST_TYPE
        },
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    isReact: true,
    hasReadme: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    fetchParams(widget, toolbox) {
        let blueprintId = toolbox.getContext().getValue('blueprintId');
        blueprintId = _.isEmpty(widget.configuration.blueprintIdFilter)
            ? blueprintId
            : widget.configuration.blueprintIdFilter;
        const obj = { blueprint_id: blueprintId };

        const siteName = toolbox.getContext().getValue('siteName');
        if (siteName) {
            obj.site_name = siteName;
        }

        if (toolbox.getContext().getValue('onlyMyResources')) {
            obj.created_by = toolbox.getManager().getCurrentUsername();
        }
        return obj;
    },

    fetchData(widget, toolbox, params) {
        const deploymentDataPromise = new Stage.Common.DeploymentActions(toolbox).doGetDeployments({
            _include:
                'id,display_name,blueprint_id,visibility,created_at,created_by,updated_at,inputs,workflows,site_name,latest_execution',
            ...params
        });

        const nodeInstanceDataPromise = deploymentDataPromise
            .then(data => _.map(data.items, item => item.id))
            .then(ids =>
                new Stage.Common.SummaryActions(toolbox).doGetNodeInstances('deployment_id', {
                    _sub_field: 'state',
                    deployment_id: ids
                })
            );

        const latestExecutionsDataPromise = deploymentDataPromise
            .then(data => _.map(data.items, item => item.latest_execution))
            .then(ids =>
                new Stage.Common.ExecutionActions(toolbox).doGetAll({
                    _include:
                        'id,deployment_id,workflow_id,status,status_display,created_at,scheduled_for,ended_at,parameters,error,total_operations,finished_operations',
                    id: ids
                })
            );

        return Promise.all([deploymentDataPromise, nodeInstanceDataPromise, latestExecutionsDataPromise]).then(data => {
            const { NodeInstancesConsts } = Stage.Common;
            const deploymentData = data[0];
            const nodeInstanceData = _.reduce(
                data[1].items,
                (result, item) => {
                    result[item.deployment_id] = {
                        states: NodeInstancesConsts.extractStatesFrom(item),
                        count: item.node_instances
                    };
                    return result;
                },
                {}
            );
            const latestExecutionData = _.reduce(
                data[2].items,
                (result, latestExecution) => {
                    result[latestExecution.deployment_id] = latestExecution;
                    return result;
                },
                {}
            );

            return {
                ...deploymentData,
                items: _.map(deploymentData.items, item => {
                    return {
                        ...item,
                        nodeInstancesCount: nodeInstanceData[item.id] ? nodeInstanceData[item.id].count : 0,
                        nodeInstancesStates: nodeInstanceData[item.id] ? nodeInstanceData[item.id].states : {},
                        created_at: Stage.Utils.Time.formatTimestamp(item.created_at), // 2016-07-20 09:10:53.103579
                        updated_at: Stage.Utils.Time.formatTimestamp(item.updated_at),
                        isUpdated: !_.isEqual(item.created_at, item.updated_at),
                        lastExecution: latestExecutionData[item.id]
                    };
                }),
                total: _.get(deploymentData, 'metadata.pagination.total', 0),
                blueprintId: params.blueprint_id
            };
        });
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const selectedDeployment = toolbox.getContext().getValue('deploymentId');
        const formattedData = {
            ...data,
            items: _.map(data.items, item => {
                return {
                    ...item,
                    isSelected: selectedDeployment === item.id
                };
            })
        };

        return <DeploymentsList widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
