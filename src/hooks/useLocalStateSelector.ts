import {sortedBy} from '../utils/sorted';
import {useAppSelector} from './hooks';

interface IListFilter {
  list: Array<Record<string, unknown>>;
  filter: Record<string, unknown[]>;
  criteria?: 'or' | 'and';
}

export const useLocalStateSelector = () => {
  const {
    assetcategory,
    assettypes,
    assettypesprops,
    assetprops,
    assetpropsanswer,
    asset,
    assetaffectedarea,
    assetaffectedareafloor,
    assetaffectedarearoom,
    points,
    building,
    floor,
    note,
    user,
    plan,
    plantypes,
    pdfdocumentsmodel,
    file,
    room,
    history,
    assignmentfolder,
    assignmentpanel,
    subcontractor,
    preferredassetcontractor,
    workorder,
    workorderasset,
    workorderbucket,
    workordertechnician,
    workorderstatuses,
    bucket,
    customer,
  } = useAppSelector(state => state.local.db);

  const getWOAssets = (id: string) => {
    return workorderasset
      ? Object.values(workorderasset)
          .filter(a => a.workOrderId === id)
          .map(a => ({
            ...asset[a.assetId],
            category:
              assetcategory && assetcategory[asset[a.assetId].categoryId],
            types: assettypes && assettypes[asset[a.assetId].typeId],
          }))
      : [];
  };

  const getWOBuckets = (id: string) => {
    return workorderbucket
      ? Object.values(workorderbucket)
          .filter(b => b.workOrderId === id)
          .map(b => ({...bucket[b.bucketId]}))
      : [];
  };

  const getWOTechnicians = (id: string) => {
    return workordertechnician
      ? Object.values(workordertechnician)
          .filter(t => t.workOrderId === id)
          .map(t => ({...user[t.technicianId]}))
      : [];
  };

  const getWOStatuses = (id: string) => {
    return workorderstatuses
      ? Object.values(workorderstatuses).filter(s => s.workOrderId === id)
      : [];
  };

  const listFilter = ({list, filter, criteria = 'or'}: IListFilter) => {
    if (!Array.isArray(list)) {
      return {count: 0, payload: []};
    }

    if (!list || !list.length) {
      return {count: 0, payload: list || []};
    }

    const isSingleCheck = criteria === 'or';

    const payload = list.filter(entity => {
      let isAllCorrect = true;

      for (const [filterKey, filterValue] of Object.entries(filter)) {
        const result = filterValue.includes(entity[filterKey]);

        if (result && isSingleCheck) {
          return true;
        } else if (!result) {
          isAllCorrect = false;
        }
      }

      return isAllCorrect;
    });

    return {count: payload.length, payload};
  };

  const getLocalWOs = (params: {[key: string]: any}) => {
    const filteredWOs = Object.values(workorder).reduce((acc, el) => {
      for (let p in params) {
        if (!Array.isArray(p)) {
          if (el[p] === params[p]) {
            acc = [...acc, el];
          }
        } else {
          if (p.includes(el[p])) {
            acc = [...acc, el];
          }
        }
      }
      return acc;
    }, []);

    const workOrders =
      filteredWOs.map(el => {
        const WO = workorder[el.id];
        const creator = user[workorder[el.id]?.creatorId];
        const buckets = getWOBuckets(el.id);
        const assets = getWOAssets(el.id);
        const technicians = getWOTechnicians(el.id);

        const res = {
          ...WO,
          creator,
          customer: customer[creator?.customerId],
          building: building[WO?.buildingId],
        };

        if (WO?.floorId) {
          res.floor = floor[WO.floorId];
        }
        if (WO?.roomId) {
          res.room = floor[WO.roomId];
        }
        buckets.length > 0 ? (res.buckets = buckets) : (res.buckets = []);
        assets.length > 0 ? (res.assets = assets) : (res.assets = []);
        technicians.length > 0
          ? (res.technicians = technicians)
          : (res.technicians = []);

        return res;
      }) || [];

    return workOrders;
  };

  const getLocalWOById = (id: string) => {
    const WO = workorder[id];
    const creator = user[workorder[id]?.creatorId];
    const assets = getWOAssets(id);
    const buckets = getWOBuckets(id);
    const technicians = getWOTechnicians(id);
    const workOrderStatuses = getWOStatuses(id);

    const res = {
      ...WO,
      creator,
      customer: customer[creator?.customerId],
      building: building[WO?.buildingId],
      buckets,
    };

    if (WO?.floorId) {
      res.floor = floor[WO.floorId];
    }
    if (WO?.roomId) {
      res.room = floor[WO.roomId];
    }

    buckets.length > 0 ? (res.buckets = buckets) : (res.buckets = []);
    assets.length > 0 ? (res.assets = assets) : (res.assets = []);

    technicians.length > 0
      ? (res.technicians = technicians)
      : (res.technicians = []);

    workOrderStatuses.length > 0
      ? (res.workOrderStatuses = workOrderStatuses)
      : (res.workOrderStatuses = []);

    return res;
  };

  const getLocalWOByAssetId = (assetId: string) => {
    const res = Object.values(workorderasset)
      .filter(el => el.assetId === assetId)
      .map(el => ({
        ...workorder[el.workOrderId],
        creator: user[workorder[el.workOrderId]?.creatorId]
          ? user[workorder[el.workOrderId]?.creatorId]
          : null,
        building: workorder[el.workOrderId]?.buildingId
          ? building[workorder[el.workOrderId].buildingId]
          : null,
        buckets: Object.values(workorderbucket)
          .filter(b => b.workOrderId === el.workOrderId)
          .map(b => ({...bucket[b.bucketId]})),
      }));
    return res || [];
  };

  const getLocalSubcontractorsByAssetId = (assetId: string) => {
    return (
      Object.values(preferredassetcontractor)
        .filter(el => el.assetId === assetId)
        .map(el => ({
          ...el,
          subcontractor: subcontractor[el.subcontractorId],
        })) || []
    );
  };

  const getLocalAssetFeds = (id: string, fedType: string) => {
    const res = Object.values(points)
      .filter(el => (fedType === 'to' ? el.toId === id : el.fromId === id))
      .map(el =>
        fedType === 'to'
          ? {
              ...el,
              from: {
                ...asset[el.fromId],
                category: assetcategory[asset[el.fromId].categoryId],
              },
            }
          : {
              ...el,
              to: el.toId && {
                ...asset[el.toId],
                category: assetcategory[asset[el.toId].categoryId],
              },
            },
      )
      .filter(el => (fedType === 'to' ? el : el.toId));

    return res || [];
  };

  const getLocalAffectedFloorsRooms = (id: string) => {
    const res = {
      rooms: Object.values(assetaffectedarearoom)
        .filter(el => el.assetAffectedAreaId === id)
        .map(el => ({...el, room: room[el.roomId]})),
      floors: Object.values(assetaffectedareafloor)
        .filter(el => el.assetAffectedAreaId === id)
        .map(el => ({...el, floor: floor[el.floorId]})),
    };
    return res || [];
  };

  const getLocalAssetAffectedAreaByAssetId = (assetId: string) => {
    const res = Object.values(assetaffectedarea)
      .filter(el => el.assetId === assetId)
      .map(el => ({...el, building: building[el.buildingId]}));
    return res || [];
  };

  const getLocalPagesByAssetId = (assetId: string) => {
    const newArray = Object.values(points).filter(el => el.fromId === assetId);

    const filteredArray: any[] = [];
    newArray.filter(item => {
      if (!filteredArray.some(element => element.pageId === item.pageId)) {
        filteredArray.push(item);
      }
    });

    const res = filteredArray.map(el => ({
      childFile: Object.values(file).find(
        f => f.pdfChildId === el.pageId || f.pdfRootId === el.pageId,
      ),
      ...pdfdocumentsmodel[el.pageId],
      plan: {
        ...plan[pdfdocumentsmodel[el.pageId].planId],
        planTypes:
          plantypes[plan[pdfdocumentsmodel[el.pageId]?.planId]?.planTypeId],
      },
    }));
    return res || [];
  };

  const getLocalAssignmentPanelsByFolderId = (folderId: string) => {
    return (
      sortedBy(
        'panelNumber',
        Object.values(assignmentpanel)
          .filter(el => el.folderId === folderId)
          .map(el =>
            el.assetId
              ? {...el, asset: asset[el.assetId]}
              : el.roomId
              ? {...el, room: room[el.roomId]}
              : el,
          ),
      ) || []
    );
  };

  const getLocalAssignmentFoldersByAssetId = (assetId: string) => {
    return (
      Object.values(assignmentfolder).filter(el => el.assetId === assetId) || []
    );
  };

  const getLocalFilesByAssetsId = (assetId: string) => {
    return Object.values(file).filter(el => el.assetFileId === assetId) || [];
  };

  const getLocalMOPSByAssetsId = (assetId: string) => {
    return Object.values(file).filter(el => el.assetMopId === assetId) || [];
  };

  const getLocalAssetHistory = (assetId: string, serialNumber: string) => {
    return sortedBy(
      'createdAt',
      Object.values(history)
        .filter(el => el.link === assetId || el.link === serialNumber)
        .map(el => ({...el, user: user[el.userId]})),
      true,
    );
  };

  const getLocalRoomsByPageId = (pageId: string) => {
    return [];
  };

  const getLocalPages = (planId: string) => {
    return pdfdocumentsmodel
      ? sortedBy(
          'name',
          Object.values(pdfdocumentsmodel)
            .filter(el => el.planId === planId)
            .map(el => Object.values(file).filter(f => f.pdfRootId === el.id))
            .flatMap(e => e)
            .map(el => ({id: el.id, name: el.name, file: el})),
        )
      : [];
  };

  const getLocalNotes = (searchId: string) => {
    return Object.values(note || {})
      .filter(
        (el: any) =>
          el.creatorId === searchId ||
          el.buildingId === searchId ||
          el.floorId === searchId ||
          el.roomId === searchId ||
          el.assetId === searchId ||
          el.subcontractorId === searchId ||
          el.workOrderId === searchId ||
          el.bucketId === searchId,
      )
      .map((el: any) => ({
        ...el,
        creator: user[el.creatorId],
        noteFiles: Object.values(file).filter((f: any) => f.noteId === el.id),
      }))
      .sort((a, b) => {
        if (a.lastUpdateDate > b.lastUpdateDate) {
          return -1;
        }
        if (a.lastUpdateDate < b.lastUpdateDate) {
          return 1;
        }
        return 0;
      });
  };

  const getLocalBuildings = (filter?: any) => {
    return listFilter({list: Object.values(building), filter});
  };

  const getLocalFloors = (filter?: any) => {
    return listFilter({list: Object.values(floor), filter});
  };

  const getLocalRooms = (filter?: any) => {
    return listFilter({list: Object.values(room), filter});
  };

  const getLocalBuilding = (buildingId: string) => {
    const avatar =
      Object.values(file).find(el => el.buildingAvatarId === buildingId) ||
      null;

    const currentBuilding = building[buildingId];

    return {...currentBuilding, avatar};
  };

  const getLocalAssetCategory = ({buildingId}: {buildingId?: string}) => {
    return Object.values(assetcategory || {}).map((el: any) => {
      const assetsCount = buildingId
        ? Object.values(asset || {}).filter(
            (as: any) =>
              as.buildingId === buildingId && as.categoryId === el.id,
          ).length
        : Object.values(asset || {}).filter((a: any) => a.categoryId === el.id)
            .length;

      return {...el, assetsCount};
    });
  };

  const getLocalAssetTypes = ({
    categoryId,
    buildingId,
  }: {
    categoryId: string;
    buildingId?: string;
  }) => {
    return Object.values(assettypes || {})
      .filter((t: any) => t.categoryId === categoryId)
      .map((el: any) => {
        const assetsCount = buildingId
          ? Object.values(asset || {}).filter(
              (a: any) => a.typeId === el.id && a.buildingId === buildingId,
            ).length
          : Object.values(asset || {}).filter((a: any) => a.typeId === el.id)
              .length;

        return {...el, assetsCount};
      });
  };

  const getLocalAssetTypeProps = (assetTypeId: string) => {
    return {
      data: {
        assetProps: Object.values(assettypesprops || {})
          .filter((p: any) => p.assetTypeId === assetTypeId)
          .map((el: any) => ({...el, ...assetprops[el.assetPropId]})),
      },
    };
  };

  const getLocalAssetsByCategoryId = (categoryId: string) => {
    return Object.values(asset || {})
      .filter((el: any) => el.categoryId === categoryId)
      .map((el: any) => {
        return {
          ...el,
          category: assetcategory && assetcategory[el.categoryId],
          types: assettypes && assettypes[el.typeId],
          building: building && building[el.buildingId],
          pagesCount: Object.values(points || {}).filter(
            (point: any) => point.fromId === el.id && point.type === 'POINT',
          ).length,
        };
      });
  };

  const getLocalAssetsById = (assetId: string) => {
    const res = asset && asset[assetId];

    const assetPropsAnswers = Object.values(assetpropsanswer || {})
      .filter((el: any) => el.assetId === assetId)
      .map((el: any) => ({
        ...el,
        assetProp: assetprops && assetprops[el.assetPropId],
      }));

    return {
      ...res,
      category: assetcategory && assetcategory[res?.categoryId],
      types: assettypes && assettypes[res?.typeId],
      building: building && building[res?.buildingId],
      plansCount: Object.values(points || {}).filter(
        (point: any) => point.fromId === res?.id && point?.type === 'POINT',
      ).length,
      assetPropsAnswers,
    };
  };

  const getLocalPoints = (pageId: string) => {
    return Object.values(points || {})
      .filter((el: any) => el.pageId === pageId)
      .map((point: any) => {
        const fromPoint = asset && asset[point.fromId];
        const toPoint =
          asset && point.toId ? asset[point.toId] : asset[point.fromId];

        return {
          ...point,
          from: {
            ...fromPoint,
            category: assetcategory && assetcategory[fromPoint.categoryId],
          },
          to: {
            ...toPoint,
            category: assetcategory && assetcategory[toPoint.categoryId],
          },
        };
      });
  };

  return {
    getLocalRoomsByPageId,
    getLocalPages,
    getLocalPagesByAssetId,
    getLocalBuildings,
    getLocalBuilding,
    getLocalFloors,
    getLocalRooms,
    getLocalNotes,
    getLocalWOs,
    getLocalWOById,
    getLocalWOByAssetId,
    getLocalPoints,
    getLocalAssetTypes,
    getLocalAssetCategory,
    getLocalAssetTypeProps,
    getLocalAssetsById,
    getLocalAssetsByCategoryId,
    getLocalAssetHistory,
    getLocalAssetFeds,
    getLocalAffectedFloorsRooms,
    getLocalAssetAffectedAreaByAssetId,
    getLocalFilesByAssetsId,
    getLocalMOPSByAssetsId,
    getLocalAssignmentFoldersByAssetId,
    getLocalAssignmentPanelsByFolderId,
    getLocalSubcontractorsByAssetId,
  };
};
