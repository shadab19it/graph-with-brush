import React from "react";
import Graph from "./components/Graph/Graph";
import { ParentSize } from "@vx/responsive";

const App = () => {
  return (
    <div
      style={{
        margin: "0 auto",
        width: "900px",
        height: "200px",
        paddingTop: "100px",
      }}>
      <ParentSize>{({ width, height }) => <Graph width={width} height={height} />}</ParentSize>
    </div>
  );
};

export default App;
