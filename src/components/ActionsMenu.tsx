import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {colors} from '../styles/colors';
import {FC} from 'react';
import {StyleSheet, Text} from 'react-native';

type ActionsMenuProps = {
  menuConfig: {
    menuButton: JSX.Element;
    items: {
      icon: JSX.Element;
      text: string;
      textColor?: string;
      action: () => void;
    }[];
  };
};

export const ActionsMenu: FC<ActionsMenuProps> = ({menuConfig}) => {
  const {menuButton, items} = menuConfig;
  return (
    <Menu>
      <MenuTrigger>{menuButton}</MenuTrigger>
      <MenuOptions customStyles={{optionsContainer: styles.editMenu}}>
        {items.map((item, i) => (
          <MenuOption
            key={i + 1}
            onSelect={item.action}
            customStyles={{optionWrapper: styles.editMenuItem}}>
            {item.icon}
            <Text
              style={[
                styles.editMenuItemText,
                item.textColor && {color: item.textColor},
              ]}>
              {item.text}
            </Text>
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  editMenu: {
    minWidth: 220,
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
    minWidth: 270,
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
