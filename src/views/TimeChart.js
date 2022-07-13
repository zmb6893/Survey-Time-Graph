import React, { useRef } from "react";
import * as d3 from "d3";
 
/**
 * Creates an uncontrolled component for a time chart given data and dimensions
 * @param {*} param0 
 */
const TimeChart = ({data, dimensions}) => {
    // Create an svg for later use
    const svgRef = useRef(null);

    // Set the dimensions of the graph
    const { width, height, margin } = dimensions;
    const svgHeight = height + margin.top + margin.bottom;
    const svgWidth = width + margin.left + margin.right;

    // Set the dimensions of the cells
    const cellSize = 15;
    const daysHeight = cellSize * 5;
    const formatDay = d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Update the TimeChart
    React.useEffect( () => {
        // Set the x-and-y axes
        const xAxis = d3.scaleTime()
            .domain(d3.extent(data[0].items, (d) => d.day))
            .range([0, width]);
        const yAxis = d3.scaleTime()
            .domain(d3.extent(data[0].items, (d) => d.time))
            .range([0, height]);
    }, [data]);

    // Return the new svg component
    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
}

export default TimeChart;