import React from "react";
import { ParentSize } from "@vx/responsive";
import TimeGraph from "./components/TimeGraph/TimeGraph";

const App = () => {
  return (
    <div
      style={{
        margin: "0 auto",
        width: "80vw",
        height: "150px",
        paddingTop: "100px",
      }}>
      <ParentSize>
        {({ width, height }) => <TimeGraph width={width} height={height} bgColor='#f0f0f0' duration={Number(500)} barColor='#17b978' />}
      </ParentSize>
      <div style={{ padding: "20px 0" }}></div>
      <ParentSize>
        {({ width, height }) => <TimeGraph width={width} height={height} bgColor='#f0f0f0' duration={Number(800)} barColor='red' />}
      </ParentSize>
    </div>
  );
};

export default App;
