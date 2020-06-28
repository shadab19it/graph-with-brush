import React from "react";
import { Group } from "@vx/group";
import { AreaClosed } from "@vx/shape";
import { ScaleType } from "@vx/shape/lib/types";
import { AxisBottom } from "@vx/axis";
import { curveMonotoneX } from "@vx/curve";
import { scaleUtc, scaleLinear, scaleLog, scaleBand } from "@vx/scale";
import { AppleStock } from "@vx/mock-data/lib/mocks/appleStock";

// Initialize some variables
const axisColor = "#fff";
const axisBottomTickLabelProps = {
  textAnchor: "middle" as const,
  fontFamily: "Arial",
  fontSize: 10,
  fill: axisColor,
};
type Scale = any;
type ScaleInput = any;

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;

export default function AreaChart({
  data,
  backgroundColor,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  top,
  left,
  children,
}: {
  data: AppleStock[];
  backgroundColor: string;
  xScale: ScaleType;
  yScale: ScaleType;
  width: number;
  yMax: number;
  margin: { top: number; right: number; bottom: number; left: number };
  hideBottomAxis?: boolean;
  top?: number;
  left?: number;
  children?: React.ReactNode;
}) {
  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <AreaClosed<AppleStock>
        data={data}
        x={(d) => xScale(getDate(d)) || 0}
        y={(d) => yScale(getStockValue(d)) || 0}
        yScale={yScale}
        fill={`url(#${backgroundColor})`}
        curve={curveMonotoneX}
      />

      <AxisBottom<ScaleInput>
        top={yMax}
        scale={xScale}
        numTicks={width > 520 ? 10 : 5}
        stroke={axisColor}
        tickStroke={axisColor}
        tickLabelProps={() => axisBottomTickLabelProps}
      />
      {children}
    </Group>
  );
}
