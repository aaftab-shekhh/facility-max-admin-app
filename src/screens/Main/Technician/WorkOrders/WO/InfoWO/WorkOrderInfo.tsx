import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {OrderType} from '../../../../../../types/StateType';
import {FC, useState} from 'react';
import {useAppNavigation} from '../../../../../../hooks/hooks';
import {stylesModal} from '../../../../../../styles/styles';
import {colors} from '../../../../../../styles/colors';
import {EditInfoWO} from './EditInfoWO';
import {getTab} from '../../../../../../utils/getTab';
import {DetailsWO} from './DetailsWO';
import {CreatorDetails} from './CreatorDetails';
import {AssetAndLocation} from './AssetAndLocation';
import {StatusWO} from './StatusWO';
import {useOrientation} from '../../../../../../hooks/useOrientation';
import {MyButton} from '../../../../../../components/MyButton';
import {EditIcon} from '../../../../../../assets/icons/EditIcon';
import {UserRole} from '../../../../../../enums/user';

type WorkOrderInfoProps = {
  order: OrderType;
  getWO: () => void;
};

export const WorkOrderInfo: FC<WorkOrderInfoProps> = ({order, getWO}) => {
  const navigation = useAppNavigation();
  const {numColumn, onLayout} = useOrientation();

  const [edit, setEdit] = useState(false);

  const closeWO = ({title}: {title?: string}) => {
    navigation.getState().routeNames[0] === 'PDFPlan'
      ? navigation.navigate('Plan', {
          screen: 'CloseWorkOrder',
          params: {id: order.id},
        })
      : navigation.getState().routeNames[0] === 'Scaner'
      ? navigation.navigate('QR', {
          screen: 'CloseWorkOrder',
          params: {id: order.id, title},
        })
      : navigation.navigate('Main', {
          screen: UserRole.TECHNICIAN,
          params: {
            screen: getTab(navigation.getState().routeNames[0]),
            params: {
              screen: 'CloseWorkOrder',
              params: {id: order.id, title},
            },
          },
        });
  };

  return (
    <View
      style={styles.container}
      onLayout={event => {
        onLayout(event.nativeEvent.layout.width);
      }}>
      {order && (
        <>
          {edit ? (
            <EditInfoWO
              order={order}
              setIsEdit={() => setEdit(!edit)}
              numColumn={numColumn}
            />
          ) : (
            <>
              <ScrollView
                contentContainerStyle={[styles.scrollContainer]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={getWO}
                    colors={[colors.mainActiveColor]} // for android
                    tintColor={colors.mainActiveColor} // for ios
                  />
                }>
                <StatusWO
                  order={order}
                  closeWO={({title}) => closeWO({title})}
                />
                <DetailsWO order={order} numColumn={numColumn} />
                <CreatorDetails order={order} numColumn={numColumn} />
                <AssetAndLocation
                  order={order}
                  getWO={getWO}
                  numColumn={numColumn}
                />
              </ScrollView>

              <View style={stylesModal.modalButtons}>
                <MyButton
                  text={'Edit'}
                  leftIcon={<EditIcon stroke={colors.bottomActiveTextColor} />}
                  action={() => setEdit(!edit)}
                  style={'main'}
                />
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    marginHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 65,
    gap: 10,
  },

  section: {
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.calendarBsckGround,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    flex: 0.9,
  },
  subcontainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 5,
  },
  subcontainerTitle: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  instructions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.mainActiveColor,
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
  },
  buttonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  buttonView: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
  buttonViewText: {
    fontSize: 12,
    lineHeight: 18,
  },
  itemContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 5,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 10,
  },
  itemTitle: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },
  assets: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10,
    gap: 10,
  },
  files: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  buttons: {
    position: 'relative',
    marginHorizontal: 0,
    marginTop: 20,
  },
  column: {
    gap: 10,
  },
  row: {
    gap: 40,
    flexDirection: 'row',
  },
});
