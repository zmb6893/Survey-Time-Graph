import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { selectAll, svg } from 'd3';

/**
 * Creates an svg to represent the time availability based on google form data.
 * @param {*} param0 
 * @returns 
 * @author Zoe Bingham
 */
const Heatmap = ({graphColor, theme, data}) => {

    // Create a reference for our svg
    const Chart = useRef();

    // Set the dimensions of the chart svg
    const dimensions = {
        width: 700,
        height: 500,
        margin: {top:50, left:30, bottom:50, right:150}
    }

    const cellSize = 30;

    // // Sample data
    // function generateValues() {
    //     return Array.from({length:12}, () => (Math.floor(Math.random()*100)+1)/100)
    // }

    // const data = [
    //     {day: 'Sun', dayValue: 0, am: generateValues(), pm: generateValues()},
    //     {day: 'Mon', dayValue: 1, am: generateValues(), pm: generateValues()},
    //     {day: 'Tue', dayValue: 2, am: generateValues(), pm: generateValues()},
    //     {day: 'Wed', dayValue: 3, am: generateValues(), pm: generateValues()},
    //     {day: 'Thu', dayValue: 4, am: generateValues(), pm: generateValues()},
    //     {day: 'Fri', dayValue: 5, am: generateValues(), pm: generateValues()},
    //     {day: 'Sat', dayValue: 6, am: generateValues(), pm: generateValues()}
    // ]


    const timeData = [
        {time: '12:00-1:00', timeValue: 0},
        {time: '1:00-2:00', timeValue: 1},
        {time: '2:00-3:00', timeValue: 2},
        {time: '3:00-4:00', timeValue: 3},
        {time: '4:00-5:00', timeValue: 4},
        {time: '5:00-6:00', timeValue: 5},
        {time: '6:00-7:00', timeValue: 6},
        {time: '7:00-8:00', timeValue: 7},
        {time: '8:00-9:00', timeValue: 8},
        {time: '9:00-10:00', timeValue: 9},
        {time: '10:00-11:00', timeValue: 10},
        {time: '11:00-12:00', timeValue: 11}
    ]

    useEffect( () => {
        // Define the size and posision of our svg
        const svg = d3.select(Chart.current)
                        .attr('width', dimensions.width)
                        .attr('height', dimensions.height)
                        .style('background-color', theme.backgroundColor)
                        .style('border', theme.border)
        
        // Create the x-scale
        const x = d3.scaleLinear()
                    .domain([0, data.length])
                    .range([0, dimensions.width - dimensions.margin.right])

        // Create the y-scale
        const y = d3.scaleLinear()
                    .domain([0, timeData.length])
                    .range([0, dimensions.height-dimensions.margin.top-dimensions.margin.bottom])

        // Add the labels for the days
        svg.append('g')
            .selectAll('text')
            .data(data)
            .join('text')
            .text( d => `${d.day}`)
            .attr('x', (d) => x(d.dayValue) + 20 + dimensions.margin.left + 100) 
            .attr('y', dimensions.height - dimensions.margin.bottom)
            .attr('fill', theme.textColor)
        
        // Add the labels for the times
        svg.append('g')
            .selectAll('text')
            .data(timeData)
            .join('text')
            .text( d => `${d.time}`)
            .attr('x', dimensions.margin.left) 
            .attr('y', (d) => y(d.timeValue) + dimensions.margin.top + 15)
            .attr('fill', theme.textColor)

        // Draw blocks
        data.forEach((day, i) => {

            // Clean off previous color. This is necessary because the colors would stack up on each other when the graphcolor changed.
            // AM
            svg.append('g')
                .selectAll('rect')
                .data(day.am)
                .join('rect')
                .attr('x', x(day.dayValue) + 5 + dimensions.margin.left + 100)
                .attr('y', (d,j) => j*(cellSize + 2) + dimensions.margin.top)
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('fill', theme.backgroundColor)
                .attr('fill-opacity', 1)
            
            // PM 
            svg.append('g')
                .selectAll('rect')
                .data(day.pm)
                .join('rect')
                .attr('x', x(day.dayValue) + cellSize + 7 + dimensions.margin.left + 100)
                .attr('y', (d,j) => j*(cellSize + 2) + dimensions.margin.top)
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('fill', theme.backgroundColor)
                .attr('fill-opacity', 1)

            // Repaint
            // AM
            console.log(graphColor);
            console.log(day.am);
            svg.append('g')
                .selectAll('rect')
                .data(day.am)
                .join('rect')
                .attr('x', x(day.dayValue) + 5 + dimensions.margin.left + 100)
                .attr('y', (d,j) => j*(cellSize + 2) + dimensions.margin.top)
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('fill', graphColor)
                .attr('fill-opacity', d => (d/30).toString())
            
            // PM 
            svg.append('g')
                .selectAll('rect')
                .data(day.pm)
                .join('rect')
                .attr('x', x(day.dayValue) + cellSize + 7 + dimensions.margin.left + 100)
                .attr('y', (d,j) => j*(cellSize + 2) + dimensions.margin.top)
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('fill', graphColor)
                .attr('fill-opacity', d => (d/30).toString())
        })
    });

    

    return (
        <div>
            <h2> Best Time Availability </h2>
            <svg ref={Chart}/>
            <p>How to read the graph: The darkest hues indicate the best meeting times, while the lighter hues indicate less optimal meeting times.</p>
            <p>**Note: Left side of each day is AM and right side is PM**</p>
        </div>
    );
}

export default Heatmap;