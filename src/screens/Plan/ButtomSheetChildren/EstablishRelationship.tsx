import {
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors} from '../../../styles/colors';
import {FC, useEffect, useState} from 'react';
import {SearchIcon} from '../../../assets/icons/SearchIcon';
import {useAppDispatch, useAppSelector} from '../../../hooks/hooks';
import {getAssignedAssetsByPlanIdTC} from '../../../bll/reducers/assets-reducer';
import FastImage from 'react-native-fast-image';
import {AssetType} from '../../../types/StateType';
import {createPointsTC} from '../../../bll/reducers/point-reducer';
import {dropdownIcons} from '../../../bll/icons';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type EstablishRelationshipProps = {
  pageId: string;
  onChangeAsset: (asset: AssetType) => void;
  onChangeKeyboard?: (refName: string, value: boolean) => void;
};

export const EstablishRelationship: FC<EstablishRelationshipProps> = ({
  pageId,
  onChangeAsset,
  onChangeKeyboard,
}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {newPoints} = useAppSelector(state => state.points);
  const {points} = useAppSelector(state => state.points);
  const assets = points.filter(
    el => el.from.id !== newPoints.fromId && el.type === 'POINT',
  );

  const [keyWord, setKeyWord] = useState<string>('');

  const renderItem: ListRenderItem<any> = ({item}) => {
    return (
      <Pressable
        key={item.id}
        style={styles.assetContainer}
        onPress={() => {
          dispatch(
            createPointsTC({
              body: {
                pageId: newPoints.pageId,
                fromId: newPoints.fromId,
                fromX: newPoints.fromX,
                fromY: newPoints.fromY,
                toId: item.from.id,
                toX: item.fromX,
                toY: item.fromY,
              },
              route: 'asset',
            }),
          );
          onChangeAsset(item);
        }}>
        <FastImage
          style={[
            styles.img,
            item?.from?.category?.color && {
              backgroundColor: item?.from?.category?.color,
            },
          ]}
          source={
            item?.from?.category?.file
              ? {uri: item?.from?.category?.file.url}
              : dropdownIcons[item?.from?.category?.name]
          }
          defaultSource={require('../../../assets/img/assets/asset.png')}
        />
        <Text style={styles.assetName}>{item?.from?.name}</Text>
      </Pressable>
    );
  };

  useEffect(() => {
    if (pageId) {
      dispatch(getAssignedAssetsByPlanIdTC(pageId));
    }
  }, [pageId]);

  return (
    <NativeViewGestureHandler disallowInterruption={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Establish relationship</Text>
        <Text style={styles.subTitle}>Pinch the desired asset</Text>
        <View style={styles.containerSearch}>
          <View style={styles.inputItem}>
            <SearchIcon />
            <TextInput
              placeholder={'Search for asset'}
              placeholderTextColor={colors.textSecondColor}
              onChangeText={setKeyWord}
              onFocus={() =>
                onChangeKeyboard &&
                onChangeKeyboard('refEstablishRelationship', true)
              }
              style={styles.input}
            />
          </View>
        </View>
        {assets?.length > 0 && (
          <BottomSheetFlatList
            data={assets}
            contentContainerStyle={[
              styles.flatList,
              {marginBottom: insets.bottom},
            ]}
            renderItem={renderItem}
          />
        )}
      </View>
    </NativeViewGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  subTitle: {
    color: colors.textSecondColor,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 21,
  },
  containerSearch: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.backgroundGreyColor,
    borderRadius: 8,
    marginVertical: 8,
  },
  inputItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.backgroundMainColor,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: colors.textColor,
  },
  flatList: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  assetContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    gap: 10,
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  assetName: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});
