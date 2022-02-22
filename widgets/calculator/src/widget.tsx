// @ts-nocheck File not migrated fully to TS

import Calculator from './Calculator';

Stage.defineWidget({
    id: 'calculator',
    name: '@Simple Calculator',
    description: 'This is a sample widget for widget writing boilerplate',
    initialWidth: 12,
    initialHeight: 20,
    color: 'green',
    isReact: true,
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
    categories: [Stage.GenericConfig.CATEGORY.OTHERS],

    render(widget, data, error, toolbox) {
        return (
            <Calculator />
        );
    }
});
