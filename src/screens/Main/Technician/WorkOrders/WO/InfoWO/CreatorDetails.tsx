import {Pressable, Text, View} from 'react-native';
import {styles} from './WorkOrderInfo';
import {InfoItem} from '../../../../../../components/InfoItem';
import {FC, useState} from 'react';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {colors} from '../../../../../../styles/colors';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {useAppNavigation} from '../../../../../../hooks/hooks';
import {OrderType} from '../../../../../../types/StateType';
import {getTab} from '../../../../../../utils/getTab';
import {UserRole} from '../../../../../../enums/user';

type CreatorDetailsProps = {
  order: OrderType;
  numColumn?: number;
};

export const CreatorDetails: FC<CreatorDetailsProps> = ({order, numColumn}) => {
  const navigation = useAppNavigation();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.header, isOpen && styles.headerOpen]}>
        <Text style={styles.headerText}>Creator Details</Text>
        {isOpen ? (
          <ArrowUpIcon color={colors.textSecondColor} />
        ) : (
          <ArrowDownIcon color={colors.textSecondColor} />
        )}
      </Pressable>
      {isOpen && (
        <View style={{marginHorizontal: 15, gap: 5}}>
          <View style={numColumn === 1 ? styles.column : styles.row}>
            <View style={{flex: 1}}>
              <InfoItem
                title="Creator Name"
                text={
                  (order.creator?.lastName &&
                    `${order.creator?.firstName} ${order.creator?.lastName}`) ||
                  '-'
                }
                action={() => {
                  navigation.getState().routeNames[0] === 'PDFPlan'
                    ? navigation.navigate('Plan', {
                        screen: 'ContactInfo',
                        params: {userId: order.creator.id},
                      })
                    : navigation.getState().routeNames[0] === 'Scaner'
                    ? navigation.navigate('QR', {
                        screen: 'ContactInfo',
                        params: {userId: order.creator.id},
                      })
                    : navigation.navigate('Main', {
                        screen: UserRole.TECHNICIAN,
                        params: {
                          screen: getTab(navigation.getState().routeNames[0]),
                          params: {
                            screen: 'ContactInfo',
                            params: {userId: order.creator.id},
                          },
                        },
                      });
                }}
              />
            </View>
            <View style={{flex: 1}}>
              <InfoItem
                title="Creator Phone"
                text={order.creator?.phone || '-'}
              />
            </View>
          </View>
          <View style={{flex: 1}}>
            <InfoItem
              title="Creator Company name"
              text={order.customer?.name || '-'}
            />
          </View>
          <View style={styles.instructions}>
            <Text style={styles.itemTitle}>Special Instructions</Text>
            {order.specialInstructions && (
              <Pressable
                style={[styles.button, styles.buttonView]}
                onPress={() => {
                  navigation.getState().routeNames[0] === 'PDFPlan'
                    ? navigation.navigate('Plan', {
                        screen: 'WorkOrderInstruction',
                      })
                    : navigation.getState().routeNames[0] === 'Scaner'
                    ? navigation.navigate('QR', {
                        screen: 'WorkOrderInstruction',
                      })
                    : navigation.navigate('Main', {
                        screen: UserRole.TECHNICIAN,
                        params: {
                          screen: getTab(navigation.getState().routeNames[0]),
                          params: {
                            screen: 'WorkOrderInstruction',
                          },
                        },
                      });
                }}>
                <Text style={[styles.buttonText, styles.buttonViewText]}>
                  View Full
                </Text>
              </Pressable>
            )}
          </View>
          <Text
            style={[styles.itemText, {marginBottom: 10}]}
            numberOfLines={3}
            ellipsizeMode="tail">
            {order.specialInstructions || '-'}
          </Text>
        </View>
      )}
    </View>
  );
};
