import React, { useState, useMemo, FC } from "react";
import { scaleUtc, scaleTime, scaleLinear, scaleLog, scaleBand, scaleOrdinal } from "@vx/scale";
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
  const [filteredData, setFilteredData] = useState({
    startTime: 0,
    endTime: 0,
  });

  const graphHeight = height - margin.top - margin.bottom;
  const graphWidth = width - margin.left - margin.right;

  const TimeLineScale = scaleLinear<number>({
    domain: [0, duration],
    range: [0, duration],
    nice: true,
  });

  const getDate = (d: number) => d;
  const getStockValue = (d: number) => d;

  TimeLineScale.rangeRound([0, graphWidth]);
  // TimeLineScale.range([0, duration]);

  const xScaleBrush = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, duration] as [number, number],
        range: [0, duration],
      }),
    []
  );
  xScaleBrush.range([0, duration]);
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

    const startTime = Math.floor(x0);
    const endTime = Math.floor(x1);
    setFilteredData({ startTime, endTime });

    console.log(filteredData);
  };

  return (
    <div style={{ backgroundColor: bgColor }}>
      <svg width={width} height={height}>
        {/* <PatternLines id='Hr-lines' height={5} width={graphWidth / 8} stroke='black' strokeWidth={0.5} orientation={["vertical"]} /> */}
        <rect x={0} y={0} width={width} height={graphHeight} fill='url(#Hr-lines)' rx={0} />
        <Group top={margin.top} left={margin.left}>
          <Bar x={0} y={graphHeight / 2} width={graphWidth} height={3} fill={barColor} />
          <Brush
            xScale={xScaleBrush}
            yScale={yScaleBrush}
            width={graphWidth}
            height={graphHeight}
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
