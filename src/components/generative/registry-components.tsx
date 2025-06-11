'use client'

import { RegistryContextType } from './registry';
import { DataTableComponentRegistry } from './data-table';
import { KeyValueDisplayComponentRegistry } from './key-value-display';
import { CardComponentRegistry } from './card';
import { SimpleListComponentRegistry } from './simple-list';
import { StatsCardComponentRegistry } from './stats-card';
import { GenericBarChartComponentRegistry } from './bar-chart';

// This structure matches the user's example for the registry context
export const registeredUiComponents: RegistryContextType['components'] = {
  'DataTableComponent': DataTableComponentRegistry,
  'KeyValueDisplayComponent': KeyValueDisplayComponentRegistry,
  'CardComponent': CardComponentRegistry,
  'SimpleListComponent': SimpleListComponentRegistry,
  'StatsCardComponent': StatsCardComponentRegistry,
  'GenericBarChartComponent': GenericBarChartComponentRegistry
};

// If you also have hooks:
// export const registeredHooks: RegistryContextType['hooks'] = {
//   // ... your hooks here
// };

// You would then provide this in your main App or layout:
// <RegistryContextProvider value={{ components: registeredUiComponents, hooks: registeredHooks || {} }}>
//   <App />
// </RegistryContextProvider>

    