import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../styles/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {FC, useEffect} from 'react';
import {PlanType} from '../../types/StateType';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {getPagesTC, setPages} from '../../bll/reducers/plan-Reducer';
import {useNetInfo} from '@react-native-community/netinfo';
import {sortedBy} from '../../utils/sorted';
import {useLocalStateSelector} from '../../hooks/useLocalStateSelector';

type PlanNavButtonPagesProps = {
  onChangePage: (pageId: string) => void;
  version?: string;
};

export const PlanNavButtonPages: FC<PlanNavButtonPagesProps> = ({
  onChangePage,
  version,
}) => {
  const dispatch = useAppDispatch();
  const {isConnected} = useNetInfo();

  const {plan, pages} = useAppSelector(state => state.plan);
  // const {pdfdocumentsmodel, file} = useAppSelector(state => state.local.db);

  const {getLocalPages} = useLocalStateSelector();

  // const localPages = pdfdocumentsmodel
  //   ? sortedBy(
  //       'name',
  //       Object.values(pdfdocumentsmodel)
  //         .filter(el => el.planId === plan.id)
  //         .map(el => Object.values(file).filter(f => f.pdfRootId === el.id))
  //         .flatMap(e => e)
  //         .map(el => ({id: el.id, name: el.name, file: el})),
  //     )
  //   : [];

  useEffect(() => {
    if (plan.document?.id) {
      const params: {rootId: string; version?: number} = {
        rootId: plan.document?.id,
      };

      isConnected
        ? dispatch(getPagesTC(params))
        : dispatch(setPages(getLocalPages(plan.id)));
    }
  }, [plan, version, isConnected]);

  const renderItem = (item: PlanType) => {
    return (
      <View style={styles.item}>
        {/* <PdfPlanFileIcon /> */}

        <Text style={styles.itemText}>
          {item.rootFile?.name || item.childFile?.name}
        </Text>
      </View>
    );
  };

  return (
    <>
      {pages && pages[0] && (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          containerStyle={styles.containerStyle}
          itemContainerStyle={styles.itemContainerStyle}
          selectedTextStyle={styles.placeholderStyle}
          flatListProps={{
            style: {
              minWidth: 250,
              maxWidth: 250,
              // backgroundColor: colors.backgroundLightColor,
              borderRadius: 10,
            },
          }}
          data={sortedBy('name', pages)}
          dropdownPosition="auto"
          labelField="name"
          valueField="id"
          inverted
          placeholder={pages[0]?.rootFile?.name}
          onChange={item => {
            onChangePage(item.id);
          }}
          renderRightIcon={
            () => null
            //  (
            // <Pressable>
            //   <ArrowRightIcon />
            // </Pressable>
            // )
          }
          renderItem={renderItem}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginHorizontal: 10,
  },
  itemContainerStyle: {
    maxWidth: 250,
  },
  containerStyle: {
    maxWidth: 250,
    minWidth: 250,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },

    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 14,
    paddingBottom: 0,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },

  itemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  placeholderStyle: {
    marginRight: 10,
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 10,
  },
});
