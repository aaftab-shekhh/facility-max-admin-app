import {FC, memo, useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AssetType} from '../../../../../../types/StateType';
import {colors} from '../../../../../../styles/colors';
import {
  useAppDispatch,
  useAppNavigation,
  useAppSelector,
} from '../../../../../../hooks/hooks';
import FastImage from 'react-native-fast-image';
import {AssetTable} from './AssetTable';
import {assetsAPI} from '../../../../../../api/assetsApi';
import {setPage, setPlan} from '../../../../../../bll/reducers/plan-Reducer';
import {PDFPlan} from '../../../../../Plan/PDFPlan';
import {dropdownIcons} from '../../../../../../bll/icons';
import {NotFound} from '../../../../../../components/NotFound';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalStateSelector} from '../../../../../../hooks/useLocalStateSelector';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

type AssetPlanProps = {
  asset: AssetType;
};

const UIAssetPlan: FC<any> = memo(
  ({pages, setSelectedPage, openNewPlan, selectedPage}) => {
    return (
      <ScrollView contentContainerStyle={{paddingTop: 15}}>
        {pages.length > 0 ? (
          <>
            <ScrollView
              contentContainerStyle={styles.plans}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {pages.map(page => {
                const name = page.childFile?.name || page.rootFile?.name;
                return (
                  <Pressable
                    key={page.id}
                    style={styles.plan}
                    onPress={() => {
                      setSelectedPage(page.id);
                      openNewPlan(page.id);
                    }}>
                    <FastImage
                      source={
                        page?.plan?.planTypes?.link
                          ? {uri: page?.plan?.planTypes?.link}
                          : dropdownIcons[page?.plan?.planTypes?.name]
                      }
                      style={styles.icon}
                      defaultSource={dropdownIcons[page?.plan?.planTypes?.name]}
                    />
                    <Text
                      style={[
                        styles.planName,
                        selectedPage === page.id && styles.planNameActive,
                      ]}>
                      {name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={styles.PDFContainer}>
              {selectedPage && (
                <PDFPlan fromAsset={true} version={selectedPage} />
              )}
            </View>
          </>
        ) : (
          <View style={styles.notFoundContainer}>
            <NotFound title="No Plans Assigned To This Asset" />
          </View>
        )}

        <AssetTable />
      </ScrollView>
    );
  },
);

export const AssetPlan: FC<AssetPlanProps> = ({asset}) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const {isConnected} = useNetInfo();
  const {getLocalPagesByAssetId} = useLocalStateSelector();
  const {
    pdfdocumentsmodel,
    file,
    plan: localPlan,
  } = useAppSelector(state => state.local.db);
  const [selectedPage, setSelectedPage] = useState<string>();

  const [pages, setPages] = useState<any[]>([]);

  const openNewPlan = (planId: string) => {
    const plan = pages.find(pl => pl.id === planId);

    isConnected
      ? plan.childFile
        ? dispatch(
            setPage({
              id: plan.id,
              file: plan.childFile,
            }),
          )
        : dispatch(
            setPage({
              id: plan.id,
              file: plan.rootFile,
            }),
          )
      : (() => {
          const newPlan = localPlan[planId];
          const document = {
            ...Object.values(pdfdocumentsmodel || {}).find(
              doc => doc.planId === planId,
            ),
          };
          const rootFile = {
            ...Object.values(file || {}).find(
              el => el.pdfRootId === document.id,
            ),
          };

          dispatch(
            setPlan({
              ...newPlan,
              document: {...document, rootFile},
            }),
          );
        })();
  };

  const getPages = async () => {
    isConnected
      ? (async () => {
          const res = await assetsAPI.getAssetPagesByAssetId(asset.id);
          setPages(res.data?.pages);
          setSelectedPage(res.data?.pages[0]?.id);
          openNewPlan(res.data?.pages[0]?.id);
          res.data.pages[0]?.childFile
            ? dispatch(
                setPage({
                  id: res.data?.pages[0]?.id,
                  file: res.data?.pages[0]?.childFile,
                }),
              )
            : dispatch(
                setPage({
                  id: res.data?.pages[0]?.id,
                  file: res.data?.pages[0]?.rootFile,
                }),
              );
        })()
      : (() => {
          const res = getLocalPagesByAssetId(asset.id);
          setPages(res);
          setSelectedPage(res[0].id);
          openNewPlan(res[0].plan.id);
        })();
  };

  useEffect(() => {
    getPages();
  }, [isConnected, asset.id]);

  return (
    <View style={styles.container}>
      <UIAssetPlan
        pages={pages}
        setSelectedPage={setSelectedPage}
        openNewPlan={openNewPlan}
        selectedPage={selectedPage}
      />

      {pages && pages.length > 0 && (
        <Pressable
          onPress={() => {
            navigation.navigate('Plan', {screen: 'PDFPlan'});
          }}
          style={styles.leaveButton}>
          <Text style={styles.leaveButtonText}>View Full Plan</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  icon: {width: 25, height: 25},

  plans: {
    // flex: 1,
    paddingBottom: 5,
  },

  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
  },

  planName: {
    color: colors.textColor,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },

  planNameActive: {
    color: colors.mainActiveColor,
  },

  leaveButton: {
    height: 42,
    backgroundColor: colors.mainActiveColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
  },

  PDFContainer: {
    width: SCREEN_WIDTH - 30,
    height: SCREEN_WIDTH - 30,
    marginVertical: 10,
    marginHorizontal: 15,
  },

  leaveButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  notFoundContainer: {
    width: SCREEN_WIDTH - 30,
    height: SCREEN_WIDTH - 30,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: colors.backgroundLightColor,
  },
});
