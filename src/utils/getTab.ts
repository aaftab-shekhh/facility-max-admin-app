export const getTab = (nav: string) => {
  switch (nav) {
    case 'Map':
      return 'MapTab';
    case 'RootAssets':
      return 'MenuTab';
    case 'WorkOrders':
      return 'WorkOrdersTab';
    case 'Dashboard':
      return 'MenuTab';
    case 'EmergencyTabScreen':
      return 'EmergencyTab';
    default:
      return 'MenuTab';
  }
};
