import React, { useState, useMemo } from "react";
// import { scaleTime } from "@vx/scale";
import { scaleUtc, scaleTime, scaleLinear, scaleLog, scaleBand } from "@vx/scale";
import appleStock, { AppleStock } from "@vx/mock-data/lib/mocks/appleStock";
import { Brush } from "@vx/brush";
import { PatternLines } from "@vx/pattern";
import { Bounds } from "@vx/brush/lib/types";
import { max, extent } from "d3-array";
import AreaChart from "./AreaChart";

type Scale = any;
type ScaleInput = any;

// Initialize some variables
const stock = appleStock.slice(1000);

const brushMargin = { top: 50, bottom: 0, left: 20, right: 20 };
const PATTERN_ID = "data-lines";
export const background = "#071e3d";
const dataBackground = "#fff";
const selectedBrushStyle = {
  fill: "#f0f0f0",
  fillOpacity: 0.8,
};

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;

export type BrushProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  compact?: boolean;
};

function BrushChart({
  width,
  height,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
}: BrushProps) {
  const [filteredStock, setFilteredStock] = useState(stock);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const stockCopy = stock.filter((s) => {
      const x = getDate(s).getTime();
      const y = getStockValue(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredStock(stockCopy);
  };

  console.log("data  " + filteredStock.map((d) => d.close));

  const ChartHeight = height - margin.top - margin.bottom;

  // bounds
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(ChartHeight - brushMargin.top - brushMargin.bottom, 0);

  // scales
  const brushDateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xBrushMax],
        domain: extent(stock, getDate) as [Date, Date],
      }),
    [xBrushMax]
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(stock, getStockValue) || 0],
        nice: true,
      }),
    [yBrushMax]
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(getDate(stock[50])) },
      end: { x: brushDateScale(getDate(stock[100])) },
    }),
    [brushDateScale]
  );

  return (
    <div>
      <svg width={width} height={height}>
        <PatternLines id={PATTERN_ID} height={5} width={5} stroke={dataBackground} strokeWidth={1} orientation={["horizontal"]} />
        <rect x={0} y={0} width={width} height={height} fill={background} rx={4} />
        <AreaChart
          data={stock}
          width={width}
          yMax={yBrushMax}
          xScale={brushDateScale}
          yScale={brushStockScale}
          margin={brushMargin}
          backgroundColor={PATTERN_ID}>
          <Brush
            xScale={brushDateScale}
            yScale={brushStockScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            resizeTriggerAreas={["left", "right"]}
            brushDirection='horizontal'
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredStock(stock)}
            selectedBoxStyle={selectedBrushStyle}
          />
        </AreaChart>
      </svg>
    </div>
  );
}

export default BrushChart;
