import {Dimensions, StyleSheet} from 'react-native';
import {colors} from './colors';

export const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} =
  Dimensions.get('window');

export const styleInput = StyleSheet.create({
  inputItem: {
    flex: 1,
    width: '100%',
  },
  label: {
    color: colors.textSecondColor,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
  },
  labelError: {
    color: colors.deleteColor,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    width: '100%',
    marginTop: 2,
    height: 42,
    paddingHorizontal: 10,
    color: colors.textColor,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
  },
  multilineInput: {
    height: 130,
    textAlignVertical: 'top',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
});

export const checkboxStyles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginRight: -15,
    gap: 10,
    flex: 1,

    // marginHorizontal: 10,
  },
  borderRadius: {
    borderRadius: 5,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    color: '#000',
    // width: '100%',
  },
});

export const switchStyles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    // backgroundColor: colors.calendarBsckGround,
  },

  switchSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  switchText: {
    color: colors.textColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
  },
});

export const styleButtomBotton = StyleSheet.create({
  button: {
    flex: 1,
    height: 42,
    backgroundColor: colors.mainActiveColor,
    borderColor: colors.mainActiveColor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    gap: 10,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
});

export const stylesModal = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  inputItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
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
  filter: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
    padding: 10,
  },
  crossContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  modalTitle: {
    color: '#202534',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'center',
    marginVertical: 10,
  },
  modalPickers: {
    // position: 'relative',
  },
  modalButtons: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  modalButton: {
    flex: 1,
    backgroundColor: colors.mainActiveColor,
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.mainActiveColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
  },
  secondButton: {
    backgroundColor: colors.secondButtonColor,
    borderColor: colors.secondButtonColor,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
  modalButtonTextReset: {
    color: colors.mainActiveColor,
  },
  modalButtonReset: {
    backgroundColor: '#F4F5F7',
    borderColor: colors.mainActiveColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.33,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
