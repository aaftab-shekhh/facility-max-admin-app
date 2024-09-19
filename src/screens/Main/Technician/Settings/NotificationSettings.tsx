import {SectionList, StyleSheet, Text, View} from 'react-native';
import {NotificationSetting} from '../../../../components/NotificationSetting';
import {colors} from '../../../../styles/colors';
import {
  enumAdminNotificationSettings,
  enumSupervisirNotificationSettings,
  UserRole,
} from '../../../../enums/user';
import {useAppSelector} from '../../../../hooks/hooks';

export type NotificationSettingType = {
  id: string;
  description: string;
};

const notifications: {[key: string]: any} = {
  [UserRole.ADMIN]: [
    {
      title: 'Buildings',
      data: [
        {
          id: enumAdminNotificationSettings.NEW_BUILDING,
          description: 'New Buildings Added.',
        },
        {
          id: enumAdminNotificationSettings.NEW_TENNANT_ADDED,
          description: 'New Tenant Added.',
        },
        {
          id: enumAdminNotificationSettings.NEW_INSURANCE,
          description: 'New/Updated Insurance or Utility Documentation.',
        },
        {
          id: enumAdminNotificationSettings.NEW_TENANT_LEAS,
          description: 'New/Updated Tenant Lease Agreement.',
        },
        {
          id: enumAdminNotificationSettings.TENANT_RELOCATION,
          description: 'Tenant Relocation.',
        },
        {
          id: enumAdminNotificationSettings.CANCELLED_LEASE,
          description: 'Expired/Cancelled Lease Agreement.',
        },
        {
          id: enumAdminNotificationSettings.LEASE_RENEWALS,
          description: 'Lease Renewals.',
        },
      ],
    },
    {
      title: 'Work Orders',
      data: [
        {
          id: enumAdminNotificationSettings.WO_CREATED,
          description: 'New Work Order Creation.',
        },
        {
          id: enumAdminNotificationSettings.WO_COMPLETION,
          description: 'Work Order Completion.',
        },
        {
          id: enumAdminNotificationSettings.WO_OVERDUE,
          description: 'Overdue Work Orders.',
        },
        {
          id: enumAdminNotificationSettings.WO_NOT_OPENED,
          description: 'Unopened/Unverified Work Orders.',
        },
      ],
    },
    {
      title: 'PM',
      data: [
        {
          id: enumAdminNotificationSettings.PM_COMPLETION,
          description: 'Preventative Maintenance Performed.',
        },
        {
          id: enumAdminNotificationSettings.PM_OVERDUE,
          description: 'Overdue Preventative Maintenance.',
        },
      ],
    },
    {
      title: 'Inventory',
      data: [
        {
          id: enumAdminNotificationSettings.INVENTORY_LOW_STOCK,
          description: 'Low Stock Alerts.',
        },
        {
          id: enumAdminNotificationSettings.INVENTORY_RE_ORDER,
          description: 'Re-Order Reminders.',
        },
        {
          id: enumAdminNotificationSettings.INVENTORY_PURCHASE_REQUEST,
          description: 'Purchase Requests.',
        },
        {
          id: enumAdminNotificationSettings.INVENTORY_PARTS_TRANSFERS,
          description: 'Parts Transfers.',
        },
      ],
    },
  ],
  [UserRole.SUPERVISOR]: [
    {
      title: 'Buildings',
      data: [
        {
          id: enumSupervisirNotificationSettings.NEW_BUILDING,
          description: 'New Buildings Added.',
        },
        {
          id: enumSupervisirNotificationSettings.BUILDING_NEW_PLAN_ADDED,
          description: 'New Plans/Diagrams Added.',
        },
        {
          id: enumSupervisirNotificationSettings.BUILDING_NEW_TENNANT_ADDED,
          description: 'New Tenant Added.',
        },
        {
          id: enumSupervisirNotificationSettings.BUILDING_NEW_DOCUMENT_ADDED,
          description: 'New Building Documentation.',
        },
        {
          id: enumSupervisirNotificationSettings.BUILDING_TENANT_RELOCATIONS,
          description: 'Tenant Relocations.',
        },
      ],
    },
    {
      title: 'Work Orders',
      data: [
        {
          id: enumSupervisirNotificationSettings.WO_CREATED,
          description: 'New Work Order Creation.',
        },
        {
          id: enumSupervisirNotificationSettings.WO_STATUS_CHANGED,
          description: 'Unopened Work Orders.',
        },
        {
          id: enumSupervisirNotificationSettings.WO_PARTS_ORDERED,
          description: 'Parts Ordered.',
        },
      ],
    },
    {
      title: 'Assets',
      data: [
        {
          id: enumSupervisirNotificationSettings.ASSET_IMPORTS,
          description: 'Asset Imports.',
        },
      ],
    },
    {
      title: 'PM',
      data: [
        {
          id: enumSupervisirNotificationSettings.PM_COMPLETION,
          description: 'PM Completion.',
        },
      ],
    },
    {
      title: 'Inventory',
      data: [
        {
          id: enumSupervisirNotificationSettings.INVENTORY_LOW_STOCK,
          description: 'Low Stock Alerts.',
        },
        {
          id: enumSupervisirNotificationSettings.INVENTORY_RE_ORDER,
          description: 'Re-Order Reminders.',
        },
      ],
    },
    {
      title: 'Support',
      data: [
        {
          id: enumSupervisirNotificationSettings.SUPPORT_NEW_DOCUMENT,
          description: 'New Support Documents.',
        },
      ],
    },
  ],
};

export const NotificationSettings = () => {
  const {role} = useAppSelector(state => state.user.user);

  const renderItem = ({item}: {item: NotificationSettingType}) => {
    return <NotificationSetting setting={item} />;
  };

  return (
    <View style={styles.container}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={notifications[role]}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.title}>{title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    marginBottom: 5,
    marginTop: 10,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: colors.textColor,
  },
});
