import * as React from "react";
import { View } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";

interface ILoader {
  width: number;
  height: number;
  radius: number;
  bg: string;
  fg: string;
}

export default function Loader({ width, height, radius, bg, fg }: ILoader) {
  return (
    <View>
      <ContentLoader
        speed={1}
        width={width}
        height={height}
        backgroundColor={bg}
        foregroundColor={fg}
      >
        <Rect width={width} height={height} rx={radius} ry={radius} />
      </ContentLoader>
    </View>
  );
}
