import {StyleSheet} from 'react-native';
import {BuildingType} from '../../../../../../types/StateType';
import {FC, memo, useState} from 'react';
import {colors} from '../../../../../../styles/colors';
import {BuildingCardSmall} from './BuildingCardSmall';
import {BuildingCardBig} from './BuildingCardBig';

type BuildingCardProps = {
  building: BuildingType;
  numColumn?: number;
  isOpen?: boolean;
};

export const BuildingCard: FC<BuildingCardProps> = memo(
  ({building, numColumn, isOpen}) => {
    const [open, setOpen] = useState(isOpen ? isOpen : false);

    return (
      <>
        {open ? (
          <BuildingCardBig building={building} setOpen={setOpen} />
        ) : (
          <BuildingCardSmall
            building={building}
            setOpen={setOpen}
            numColumn={numColumn}
          />
        )}
      </>
    );
  },
);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: 15,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.buildingCardButton,
    backgroundColor: colors.bottomActiveTextColor,
    paddingHorizontal: 15,
    gap: 7,
    paddingTop: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  body: {
    flexDirection: 'row',
    gap: 10,
  },
  photo: {
    width: 36,
    height: 36,
    borderRadius: 5,
  },
  description: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  descriptionItemText: {
    flex: 1,
    flexWrap: 'wrap',
    color: colors.textColor,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
  },
  address: {
    flexWrap: 'wrap',
    color: colors.textSecondColor,
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 15,
  },

  gap: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  line: {
    height: 1,
    marginHorizontal: -15,
    backgroundColor: colors.backgroundGreyColor,
  },
  hiddeLine: {
    height: 0,
  },
  moreButton: {
    flex: 1,
    height: 30,
    backgroundColor: colors.buildingCardButton,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    marginHorizontal: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  itemText: {
    flexWrap: 'wrap',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: colors.textColor,
  },

  light: {
    lineHeight: 14,
    color: colors.textSecondColor,
  },
  itemTextHeader: {
    color: colors.textSecondColor,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});
