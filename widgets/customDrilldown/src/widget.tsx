// @ts-nocheck File not migrated fully to TS

import Calculator from './Calculator';

Stage.defineWidget({
  id: 'calculatorCfy',
  name: '@Simple Grid Cfy UI',
  description: 'This is a sample widget for widget writing boilerplate',
  initialWidth: 12,
  initialHeight: 20,
  hasStyle: true,
  color: 'green',
  isReact: true,
  showHeader: true,
  initialConfiguration: [
    Stage.GenericConfig.POLLING_TIME_CONFIG(5),
    { id: 'filter', name: 'Filter', placeHolder: "GitHub filter", description: "...", default: "blueprint in:name NOT local", type: Stage.Basic.GenericField.STRING_TYPE },
  ],
  permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
  categories: [Stage.GenericConfig.CATEGORY.OTHERS],

  render(widget, data, error, toolbox) {
    return (
      <Calculator />
    );
  }
});
