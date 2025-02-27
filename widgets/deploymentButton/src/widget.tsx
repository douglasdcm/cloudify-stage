// @ts-nocheck File not migrated fully to TS
import DeploymentButton from './DeploymentButton';

Stage.defineWidget({
    id: 'deploymentButton',
    name: 'Create deployment button',
    description: 'Adds button to create new deployment',
    initialWidth: 3,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentButton'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, data, error, toolbox) {
        return <DeploymentButton toolbox={toolbox} />;
    }
});
