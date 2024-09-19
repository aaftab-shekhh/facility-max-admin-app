export const historyConfig: any = {
  subObjects: {
    ASSET: {
      title: 'Asset',
      actions: {
        CREATE: 'was created',
        UPDATE: 'was updated',
        DELETE: 'was deleted',
      },
    },
    POINT: {
      title: 'Asset',
      actions: {
        CREATE: 'was plotted on the plan',
        UPDATE: 'was updated',
        DELETE: 'was removed from the plan',
      },
    },
  },
  userRole: {
    SUPERADMIN: 'Superadmin',
    ADMIN: 'Admin',
    SUPERVISOR: 'Supervisor',
    REQUESTOR: 'Requestor',
    TECHNICIAN: 'Technician',
  },
};
