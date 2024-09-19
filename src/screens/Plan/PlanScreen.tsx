import React, {
  RefObject,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../hooks/hooks';
import {colors} from '../../styles/colors';
import {DotsIcon} from '../../assets/icons/DotsIcon';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {NotFound} from '../../components/NotFound';
import {PlanNotes} from './ButtomSheetChildren/PlanNotes';
import {PlanVersionHistory} from './ButtomSheetChildren/PlanVersionHistory';
import {PlanNav} from './PlanNav';
import {PDFPlan} from './PDFPlan';
import {FocusAwareStatusBar} from '../../components/FocusAwareStatusBar';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {SaveSecondIcon} from '../../assets/icons/SaveSecondIcon';
import {NoteIcon} from '../../assets/icons/NoteIcon';
import {EyeSecondIcon} from '../../assets/icons/EyeSecondIcon';
import {plansAPI} from '../../api/plansApi';
import {
  getPageTC,
  getStagesTC,
  updatePlanForSaveVersion,
} from '../../bll/reducers/plan-Reducer';
import {handleServerNetworkError} from '../../utils/handleServerNetworkUtils';
import Toast from 'react-native-toast-message';

export const PlanScreen = memo(() => {
  const dispatch = useAppDispatch();
  const {page} = useAppSelector(state => state.plan);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isEditMenu, setIsEditMenu] = useState(false);

  const snapPoints = useMemo(() => ['10%', '60%', '100%'], []);

  const refVersionHistory = useRef<BottomSheetModal>(null);
  const refNotes = useRef<BottomSheetModal>(null);

  const openBottomSheet = useCallback(
    (ref: RefObject<BottomSheetModal>, index?: number) => {
      ref.current?.present();
      setTimeout(() => {
        ref.current?.snapToIndex(index || 1);
      }, 400);
    },
    [],
  );

  const toggleMenu = () => {
    setIsEditMenu(!isEditMenu);
  };

  const [version, setVersion] = useState<string>(page.id || '');

  const save = async () => {
    try {
      const res = await plansAPI.saveStagesByPageId(version);
      dispatch(updatePlanForSaveVersion(res.data.page));
      setVersion(res.data.page.id);
      dispatch(getStagesTC(res.data.page.id));
      toggleMenu();
      Toast.show({
        type: 'notification',
        text1: 'Successfully',
        text2: 'Plan version was successfully saved',
      });
    } catch (err) {
      handleServerNetworkError(err.response.data);
    }
  };

  const renderBackdrop = useCallback(props => {
    return (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'close'}
        opacity={0.5}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        animatedPosition={0}
        enableTouchThrough={false}
      />
    );
  }, []);

  useEffect(() => {
    if (version) {
      dispatch(getPageTC(version));
    }
  }, [version]);

  return (
    <BottomSheetModalProvider>
      <View style={[styles.container]}>
        <FocusAwareStatusBar barStyle="light-content" />
        <PlanNav version={version} setVersion={setVersion} />
        <Menu style={styles.editButton}>
          <MenuTrigger>
            <DotsIcon
              color={colors.headerColor}
              fill={colors.bottomActiveTextColor}
            />
          </MenuTrigger>
          <MenuOptions customStyles={{optionsContainer: styles.editMenu}}>
            <MenuOption
              onSelect={save}
              customStyles={{optionWrapper: styles.editMenuItem}}>
              <SaveSecondIcon />
              <Text style={styles.editMenuItemText}>Save current version</Text>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                toggleMenu();
                openBottomSheet(refVersionHistory);
              }}
              customStyles={{optionWrapper: styles.editMenuItem}}>
              <EyeSecondIcon color={colors.textColor} />
              <Text style={styles.editMenuItemText}>View version history</Text>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                toggleMenu();
                openBottomSheet(refNotes, 2);
              }}
              customStyles={{optionWrapper: styles.editMenuItem}}>
              <NoteIcon />
              <Text style={styles.editMenuItemText}>Notes</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>

        {!page.id ? (
          <NotFound title="Plan not found" />
        ) : (
          <>
            <PDFPlan
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              version={version}
            />
            <BottomSheetModal
              ref={refVersionHistory}
              snapPoints={snapPoints}
              backdropComponent={renderBackdrop}
              backgroundStyle={{backgroundColor: colors.backgroundMainColor}}>
              <PlanVersionHistory
                pageId={version}
                version={version}
                setVersion={setVersion}
              />
            </BottomSheetModal>

            <BottomSheetModal
              ref={refNotes}
              snapPoints={snapPoints}
              backdropComponent={renderBackdrop}
              backgroundStyle={{backgroundColor: colors.backgroundMainColor}}>
              <PlanNotes id={version} />
            </BottomSheetModal>
          </>
        )}
      </View>
    </BottomSheetModalProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  editButton: {
    position: 'absolute',
    right: 15,
  },

  editMenu: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },

  editMenuItem: {
    minWidth: 250,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  editMenuItemText: {
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    marginVertical: 5,
  },
});
