import React, { useState, useMemo, FC } from "react";
import { scaleUtc, scaleTime, scaleLinear, scaleLog, scaleBand, scaleOrdinal } from "@vx/scale";
import appleStock, { AppleStock } from "@vx/mock-data/lib/mocks/appleStock";
import cityTemperature, { CityTemperature } from "@vx/mock-data/lib/mocks/cityTemperature";
import { Brush } from "@vx/brush";
import { Bar } from "@vx/shape";
import { Group } from "@vx/group";
import { AxisBottom } from "@vx/axis";
import { PatternLines } from "@vx/pattern";
import { Bounds } from "@vx/brush/lib/types";
import { max, extent } from "d3-array";

export type BrushProps = {
  width: number;
  height: number;
  duration?: any;
  bgColor?: string;
  barColor: string;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const defaultMargin = { top: 10, left: 40, right: 40, bottom: 30 };
const selectedBrushStyle = {
  fill: "#000",
  fillOpacity: 0.8,
};

const TimeGraph: FC<BrushProps> = ({ width, height, margin = defaultMargin, duration, bgColor, barColor }) => {
  const [filteredData, setFilteredData] = useState();

  const TimeLineScale = scaleLinear<number>({
    domain: [0, duration],
    nice: true,
  });

  const graphHeight = height - margin.top - margin.bottom;
  const graphWidth = width - margin.left - margin.right;

  const getDate = (d: number) => d;
  const getStockValue = (d: number) => d;

  TimeLineScale.rangeRound([0, graphWidth]);

  const xScaleBrush = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, duration] as [number, number],
        range: [0, duration],
      }),
    []
  );
  const yScaleBrush = useMemo(
    () =>
      scaleLinear({
        domain: [0, 0],
        nice: true,
      }),
    []
  );

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    const start = x0;
    const end = x1;
    // return x > x0 && x < x1 && y > y0 && y < y1;

    const range = end - start;

    console.log(domain);
    console.log(range);

    // console.log("start " + start);
    // console.log("endTime " + end);
  };

  return (
    <div style={{ backgroundColor: bgColor }}>
      <svg width={width} height={height}>
        {/* <PatternLines id='Hr-lines' height={5} width={graphWidth / 8} stroke='black' strokeWidth={0.5} orientation={["vertical"]} /> */}
        <rect x={5} y={2} width={graphWidth} height={graphHeight} fill='url(#Hr-lines)' rx={0} />
        <Group top={margin.top} left={margin.left}>
          <Bar x={0} y={graphHeight / 2} width={graphWidth} height={3} fill={barColor} />
          <Brush
            xScale={xScaleBrush}
            yScale={yScaleBrush}
            width={graphWidth}
            height={graphHeight}
            margin={margin}
            handleSize={8}
            resizeTriggerAreas={["left", "right"]}
            brushDirection='horizontal'
            onChange={onBrushChange}
            selectedBoxStyle={selectedBrushStyle}
          />
          <AxisBottom<number>
            top={graphHeight}
            scale={TimeLineScale}
            stroke='#364f6b'
            tickStroke='#364f6b'
            tickLabelProps={() => ({
              fill: "#364f6b",
              fontSize: 12,
              textAnchor: "middle",
            })}
          />
        </Group>
      </svg>
    </div>
  );
};

export default TimeGraph;
