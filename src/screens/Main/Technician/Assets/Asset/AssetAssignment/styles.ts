import {StyleSheet} from 'react-native';
import {colors} from '../../../../../../styles/colors';
import {SCREEN_WIDTH} from '../../../../../../styles/styles';

export const styles = StyleSheet.create({
  assignmentsContainer: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 55,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 15,
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
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  container: {
    gap: 10,
  },

  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerItemTitle: {
    flex: 1,
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },

  headerItemInput: {
    flex: 1,
  },

  headerItemInputText: {
    color: colors.textSecondColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
  },

  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 10,
    rowGap: 10,
    columnGap: 10,
  },

  tableItem: {
    width: SCREEN_WIDTH * 0.5 - 25,
    backgroundColor: colors.secondInputBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
  },

  revers: {
    flexDirection: 'row-reverse',
  },

  tableItemName: {
    // flex: 1,
    color: colors.textColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    // paddingVertical: 5,
  },
  tableItemCount: {
    flex: 1,
    maxWidth: 30,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textSecondColor,
    borderRadius: 8,
  },

  tableItemCountActive: {
    backgroundColor: colors.mainActiveColor,
  },

  tableItemCountText: {
    padding: 5,
    color: colors.bottomActiveTextColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  title: {
    flexDirection: 'row',
    gap: 20,
    flex: 0.8,
    alignItems: 'center',
  },

  modalButtons: {
    position: 'relative',
    marginTop: 15,
    marginHorizontal: 0,
  },

  deleteButtonText: {
    padding: 5,
    color: colors.deleteColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  createButton: {
    marginHorizontal: 15,
    height: 42,
    backgroundColor: colors.mainActiveColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  createButtonText: {
    color: colors.mainActiveColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },

  saveButtons: {
    position: 'relative',
    marginHorizontal: 0,
  },

  newPanelcontainer: {
    justifyContent: 'flex-start',
    marginHorizontal: 15,
    gap: 10,
    paddingBottom: 55,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textColor,
  },

  menuOptions: {
    backgroundColor: colors.backgroundLightColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
});
