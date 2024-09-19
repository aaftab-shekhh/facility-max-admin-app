import {FC, useCallback, useEffect, useState} from 'react';
import {Slider} from '@miblanchard/react-native-slider';
import {colors} from '../styles/colors';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {assetsAPI} from '../api/assetsApi';
import {handleServerNetworkError} from '../utils/handleServerNetworkUtils';
import {useDispatch} from 'react-redux';
import {EverythingForkEnum} from '../enums/assets';

type CustomSliderProps = {
  label?: string;
  startValue?: number[];
  onChange?: (value: number[]) => void;
  keyItem?: string;
};

const maximumValue = 100;
const minimumValue = 0;

export const CustomSlider: FC<CustomSliderProps> = ({
  label,
  startValue,
  onChange,
  keyItem,
}) => {
  const dispatch = useDispatch();
  const [startMinMax, setStartMinMax] = useState([minimumValue, maximumValue]);
  const [value, setValue] = useState<number[]>([
    startMinMax[0],
    startMinMax[1],
  ]);
  const [minValue, maxValue] = value;
  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (keyItem) {
        const res = await assetsAPI.getDataFilters({
          type: keyItem,
        });
        setStartMinMax([res.data.payload.minValue, res.data.payload.maxValue]);
        if (startValue) {
          setValue(startValue);
        } else {
          setValue([res.data.payload.minValue, res.data.payload.maxValue]);
        }
      }
    } catch (err) {
      handleServerNetworkError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Slider
          value={value}
          maximumValue={startMinMax[1]}
          minimumValue={startMinMax[0]}
          step={1}
          trackMarks={[minValue, maxValue]}
          renderTrackMarkComponent={ind => {
            return (
              <View style={styles.valueContainer}>
                {ind ? (
                  <Text style={styles.value}>
                    {keyItem === EverythingForkEnum.ASSET_COST && '$'}
                    {maxValue}
                  </Text>
                ) : (
                  <Text style={styles.value}>
                    {keyItem === EverythingForkEnum.ASSET_COST && '$'}
                    {minValue}
                  </Text>
                )}
              </View>
            );
          }}
          onSlidingComplete={() => {
            onChange && onChange(value);
          }}
          minimumTrackTintColor={colors.mainActiveColor}
          thumbTintColor={colors.textSecondColor}
          onValueChange={val => setValue(val)}
          containerStyle={styles.containerStyle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},

  containerStyle: {
    marginHorizontal: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: colors.textColor,
  },

  valueContainer: {
    flex: 1,
    alignContent: 'center',
  },

  value: {
    flex: 1,
    marginTop: 40,
    marginLeft: 3,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondColor,
  },
});
