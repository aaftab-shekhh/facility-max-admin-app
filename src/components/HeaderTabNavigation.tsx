import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../styles/colors';
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';

type HeaderTabNavigationProps = {
  data: any;
  mode: string;
  onChange: (mode: string) => void;
};

const Item: FC<any> = ({item, index, mode, setStartIndex, onChange, data}) => {
  return (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        onChange(item.mode);
        if (index === 0) {
          return;
        }
        if (index === data.length - 1) {
          return;
        }
        setStartIndex(index);
      }}
      style={mode === item.mode ? styles.navActiveButton : styles.navButton}>
      <Text
        style={
          mode === item.mode ? styles.navActiveButtonText : styles.navButtonText
        }>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export const HeaderTabNavigation: FC<HeaderTabNavigationProps> = memo(
  ({data, mode, onChange}) => {
    const ref = useRef<FlatList<any>>();
    const [startIndex, setStartIndex] = useState(0);

    const renderItem: ListRenderItem<any> = useCallback(
      ({item, index}) => (
        <Item
          item={item}
          data={data}
          index={index}
          mode={mode}
          setStartIndex={setStartIndex}
          onChange={onChange}
        />
      ),
      [mode],
    );

    useEffect(() => {
      ref.current?.scrollToIndex({
        index: startIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, [startIndex]);

    return (
      <FlatList
        ref={ref}
        initialScrollIndex={startIndex}
        style={styles.row}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
      />
    );
  },
);

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.headerColor,
    maxHeight: 40,
    flexDirection: 'row',
    gap: 10,
    // marginBottom: 10,
  },
  navButton: {
    minWidth: 100,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  navButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    opacity: 0.5,
  },
  navActiveButton: {
    minWidth: 100,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderColor: colors.bottomActiveTextColor,
  },
  navActiveButtonText: {
    color: colors.bottomActiveTextColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});
