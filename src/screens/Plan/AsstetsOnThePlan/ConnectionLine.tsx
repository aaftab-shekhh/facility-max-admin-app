import React, {FC, MutableRefObject, memo, useEffect} from 'react';
import {useSharedValue} from 'react-native-reanimated';
import {Path} from '@shopify/react-native-skia';

type ConnectionLineProps = {
  point: {
    id: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    to: any;
    from: any;
  };
  height: number;
  width: number;
  zoomLevel: MutableRefObject<number>;
  pageId: string;
  removeAsset: (id: string) => void;
  openEstablishRelationship?: () => void;
  UIPoints: any;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
};

export const ConnectionLine: FC<ConnectionLineProps> = memo(
  ({color, fromX, fromY, toX, toY}) => {
    const startFromX = useSharedValue(fromX);
    const startFromY = useSharedValue(fromY);
    const startToX = useSharedValue(toX);
    const startToY = useSharedValue(toY);

    useEffect(() => {
      startFromX.value = fromX;
      startFromY.value = fromY;
      startToX.value = toX;
      startToY.value = toY;
    }, [fromX, fromY, toX, toY]);

    const startPoint = `M${startFromX.value},${startFromY.value}`;
    const firstLine =
      Math.abs(startToY.value - startFromY.value) > 12
        ? `L${
            startFromX.value > startToX.value
              ? Math.abs(startToX.value - startFromX.value) > 60
                ? startToX.value - (startToX.value - startFromX.value) / 2 + 10
                : Math.abs(startToX.value - startFromX.value) > 12
                ? startToX.value + 10
                : startToX.value
              : Math.abs(startToX.value - startFromX.value) > 60
              ? startToX.value - (startToX.value - startFromX.value) / 2 - 10
              : Math.abs(startToX.value - startFromX.value) > 12
              ? startToX.value - 10
              : startToX.value
          },${startFromY.value}`
        : `L${
            startFromX.value > startToX.value
              ? Math.abs(startToX.value - startFromX.value) > 12
                ? startToX.value - (startToX.value - startFromX.value) / 2 + 10
                : startToX.value
              : Math.abs(startToX.value - startFromX.value) > 60
              ? startToX.value - (startToX.value - startFromX.value) / 2 - 10
              : startToX.value
          },${startToY.value}`;

    const arrowLeftOrRight = `${
      startFromX.value > startToX.value
        ? startFromY.value > startToY.value
          ? `L${startToX.value + 12.5},${startToY.value} l8,-2 0,4 -8,-2`
          : `L${startToX.value + 12.5},${startToY.value} l8,-2 0,4 -8,-2`
        : startFromY.value > startToY.value
        ? `L${startToX.value - 12.5},${startToY.value} l-8,-2 0,4 8,-2`
        : `L${startToX.value - 12.5},${startToY.value} l-8,-2 0,4 8,-2`
    }`;

    const arrowTopOrBottom = `${
      startFromY.value > startToY.value ? 'l2,8 -4,0 2,-8' : 'l2,-8 -4,0 2,8'
    }`;

    const pathLine = `
  ${startPoint}
	${firstLine}
	${
    Math.abs(startToX.value - startFromX.value) > 12 &&
    Math.abs(startToY.value - startFromY.value) > 12
      ? startFromY.value > startToY.value
        ? startFromX.value > startToX.value
          ? 'a10,10 0 0,1 -10,-10'
          : 'a10,10 0 0,0 10,-10'
        : startFromX.value > startToX.value
        ? 'a-10,10 0 0,0 -10,10'
        : 'a10,10 0 0,1 10,10'
      : `L${startToX.value},${startToY.value}  ${
          Math.abs(startToX.value - startFromX.value) > 12
            ? arrowLeftOrRight
            : ''
        }`
  }
	${
    Math.abs(startToY.value - startFromY.value) > 12
      ? `L${
          Math.abs(startToX.value - startFromX.value) > 60
            ? startToX.value - (startToX.value - startFromX.value) / 2
            : startToX.value
        },${
          startFromY.value > startToY.value
            ? startToY.value + 10
            : startToY.value - 10
        }`
      : `L${startToX.value},${startToY.value}  ${
          Math.abs(startToX.value - startFromX.value) > 12
            ? arrowLeftOrRight
            : ''
        }`
  }
	

	${
    Math.abs(startToX.value - startFromX.value) < 60 &&
    Math.abs(startToY.value - startFromY.value) > 12
      ? `${arrowTopOrBottom}`
      : ''
  }

	${
    Math.abs(startToX.value - startFromX.value) > 60 &&
    Math.abs(startToY.value - startFromY.value) > 12
      ? startFromY.value > startToY.value
        ? startFromX.value > startToX.value
          ? `a-10,10 0 0,0 -10,-10 ${arrowLeftOrRight}`
          : `a-10,10 0 0,1 10,-10 ${arrowLeftOrRight}`
        : startFromX.value > startToX.value
        ? `a-10,10 0 0,1 -10,10 ${arrowLeftOrRight}`
        : `a10,10 0 0,0 10,10 ${arrowLeftOrRight}`
      : ''
  }
`;

    return (
      <Path path={pathLine} color={color} style="stroke" strokeWidth={2} />
    );
  },
);
