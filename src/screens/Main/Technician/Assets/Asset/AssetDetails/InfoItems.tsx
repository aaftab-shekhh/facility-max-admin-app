import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {stylesModal} from '../../../../../../styles/styles';
import {FC, useState} from 'react';
import {AssetType} from '../../../../../../types/StateType';
import {InfoItem} from '../../../../../../components/InfoItem';
import {ArrowUpIcon} from '../../../../../../assets/icons/ArrowUpIcon';
import {ArrowDownIcon} from '../../../../../../assets/icons/ArrowDownIcon';
import {colors} from '../../../../../../styles/colors';
import moment from 'moment';
import {PenLeaveIcon} from '../../../../../../assets/icons/PenLeaveIcon';
import {CalendarIcon} from '../../../../../../assets/icons/CalendarIcon';
import {useOrientation} from '../../../../../../hooks/useOrientation';
import FastImage from 'react-native-fast-image';
import {dropdownIcons} from '../../../../../../bll/icons';

type InfoItemsProps = {
  asset: AssetType;
  setIsEdit?: () => void;
};

export const InfoItems: FC<InfoItemsProps> = ({asset, setIsEdit}) => {
  const {
    name,
    category,
    types,
    manufacturer,
    model,
    serialNumber,
    installDate,
    cost,
    laborValue,
    building,
    assetPropsAnswers,
    description,
    equipmentId,
    avatar,
  } = asset;
  const {numColumn, onLayout} = useOrientation();
  const [assetInf, setAssetInf] = useState(true);
  const [properties, setProperties] = useState(false);

  const renderAdditionalProperties = () => {
    let res = [];
    for (let el in assetPropsAnswers) {
      res.push({
        name: assetPropsAnswers[el].assetProp.name,
        value:
          assetPropsAnswers[el].assetProp.type === 'Date' ||
          assetPropsAnswers[el].assetProp.type === 'DateTime'
            ? moment(assetPropsAnswers[el].value).format('MM/DD/YYYY')
            : assetPropsAnswers[el].value,
      });
    }
    return res.map((el, index) => (
      <View
        key={(index + 1).toString()}
        style={{flex: 1, minWidth: 300, height: 45}}>
        <InfoItem
          title={el.name}
          text={el.value}
          hiddeBorder={index === res.length - 1}
        />
      </View>
    ));
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        onLayout={event => {
          onLayout(event.nativeEvent.layout.width);
        }}>
        {avatar?.url && (
          <FastImage
            style={styles.photo}
            source={{
              uri: avatar?.url,
            }}
            defaultSource={dropdownIcons[category?.name]}
          />
        )}

        <View style={styles.section}>
          <Pressable
            onPress={() => setAssetInf(!assetInf)}
            style={[styles.header, assetInf && styles.headerOpen]}>
            <Text style={styles.headerText}>Asset Information</Text>
            {assetInf ? (
              <ArrowUpIcon color={colors.textSecondColor} />
            ) : (
              <ArrowDownIcon color={colors.textSecondColor} />
            )}
          </Pressable>
          {assetInf ? (
            <View style={{marginHorizontal: 15, gap: 5}}>
              <View style={numColumn === 1 ? styles.column : styles.row}>
                <View style={{flex: 1}}>
                  <InfoItem title="Name" text={name} />
                </View>
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Equipment Id"
                    text={equipmentId ? equipmentId : '-'}
                  />
                </View>
              </View>
              <View style={numColumn === 1 ? styles.column : styles.row}>
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Category"
                    img={category && category.link}
                    text={category ? category.name : '-'}
                  />
                </View>
                <View style={{flex: 1}}>
                  <InfoItem title="Type" text={types ? types.name : '-'} />
                </View>
              </View>
              <View style={numColumn === 1 ? styles.column : styles.row}>
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Manufacturer"
                    text={manufacturer ? manufacturer : 'Not Provided'}
                  />
                </View>
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Model number"
                    text={model ? model : 'Not Provided'}
                  />
                </View>
              </View>
              <View style={numColumn === 1 ? styles.column : styles.row}>
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Serial number"
                    text={serialNumber ? serialNumber : '-'}
                  />
                </View>
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Install date"
                    text={installDate ? moment(installDate).format('L') : '-'}
                    icon={<CalendarIcon />}
                  />
                </View>
              </View>
              <View style={numColumn === 1 ? styles.column : styles.row}>
                <View style={{flex: 1}}>
                  <InfoItem title="Asset cost" text={cost ? cost : '0'} />
                </View>
                <View style={{flex: 1}}>
                  <InfoItem
                    title="Current value"
                    text={laborValue ? laborValue : '0'}
                  />
                </View>
              </View>

              <InfoItem
                title="Asset location"
                text={building ? building.address : '-'}
                column
              />
              <InfoItem
                title="Description"
                text={description ? description : '-'}
                column
                hiddeBorder
              />
            </View>
          ) : null}
        </View>
        {assetPropsAnswers && assetPropsAnswers.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setProperties(!properties)}
              style={[styles.header, properties && styles.headerOpen]}>
              <Text style={styles.headerText}>Additional Properties</Text>
              {properties ? (
                <ArrowUpIcon color={colors.textSecondColor} />
              ) : (
                <ArrowDownIcon color={colors.textSecondColor} />
              )}
            </Pressable>
            {properties ? (
              <View
                style={{
                  marginHorizontal: 15,
                  rowGap: 5,
                  columnGap: 40,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {assetPropsAnswers &&
                  assetPropsAnswers.length > 0 &&
                  renderAdditionalProperties()}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
      {/* <View style={[stylesModal.modalButtons, styles.buttons]}> */}
      <Pressable onPress={setIsEdit} style={styles.editButton}>
        <PenLeaveIcon />
        <Text style={stylesModal.modalButtonText}>Edit</Text>
      </Pressable>
      {/* </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingTop: 10,
    paddingBottom: 60,
    marginHorizontal: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  printQR: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  QRText: {
    color: colors.mainActiveColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18,
  },
  section: {
    // marginBottom: 15,
    backgroundColor: colors.backgroundLightColor,
    borderRadius: 8,
    // marginHorizontal: 15,
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
  editButton: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    bottom: 0,
    height: 42,
    backgroundColor: '#1B6BC0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
  },
  column: {
    gap: 10,
  },
  row: {
    gap: 40,
    flexDirection: 'row',
  },
  photo: {
    flex: 1,
    height: 200,
    width: '100%',
    borderRadius: 10,
  },
});
