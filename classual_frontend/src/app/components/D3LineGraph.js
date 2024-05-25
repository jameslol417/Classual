import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function D3LineGraph({ data, timeLineData, visibleLines, showFirstPass, showSecondPass, decodeCourse }) {

    const svgRef = useRef();
    const legendRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        if (data.length > 0 && Object.keys(timeLineData).length > 0) {
            drawChart();
        }
    }, [data, visibleLines, showFirstPass, showSecondPass, timeLineData]);

    const drawChart = () => {

        const svg = d3.select(svgRef.current)
            .attr('width', 700)
            .attr('height', 400)
            .attr('style', 'background: white;');

        const margin = { top: 120, right: 40, bottom: 40, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const parseTime = d3.timeParse('%Y-%m-%d');
        const dataExtent = d3.extent(data, d => parseTime(d.time));

        // Include timeline dates in the xScale domain
        const timelineDates = [
            timeLineData.firstPass?.FreshmenStart,
            timeLineData.firstPass?.End,
            timeLineData.secondPass?.FreshmenStart,
            timeLineData.secondPass?.End
        ].filter(date => date).map(parseTime);


        const combinedDates = [
            ...data.map(d => parseTime(d.time)),
            parseTime(timeLineData.firstPass?.FreshmenStart),
            parseTime(timeLineData.firstPass?.End),
            parseTime(timeLineData.secondPass?.FreshmenStart),
            parseTime(timeLineData.secondPass?.End)
        ].filter(date => date);

        const xScale = d3.scaleTime()
            .domain(d3.extent(combinedDates))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.enrolledNumber, d.waitlistNumber, d.totalSeatNumber))])
            .nice()
            .range([height, 0]);

        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value));

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(['enrolledNumber', 'waitlistNumber', 'totalSeatNumber', 'FirstPass', 'Second Pass']);

        const nestedData = colorScale.domain().map(key => ({
            key,
            values: data.map(d => {
                const parsedTime = parseTime(d.time);
                const value = +d[key];
                if (isNaN(parsedTime) || isNaN(value)) {
                    return null; // Return null for invalid entries
                }
                return { time: parsedTime, value: value };
            }).filter(d => d !== null) // Filter out invalid entries
        }));

        const addShadedArea = (start, end, color, className) => {
            console.log(`Original start: ${start}, Original end: ${end}`); // Log original dates

            const parsedStart = parseTime(start);
            const parsedEnd = parseTime(end);
            if (!parsedStart || !parsedEnd) {
                console.error(`Error parsing dates: ${start}, ${end}`);
                return;
            }

            console.log(`Parsed start: ${parsedStart}, Parsed end: ${parsedEnd}`); // Log parsed dates

            if (parsedStart >= parsedEnd) {
                console.error(`Invalid date range: ${start} to ${end}`);
                return;
            }

            const [minX, maxX] = xScale.domain();
            const adjustedStart = d3.max([parsedStart, minX]);
            const adjustedEnd = d3.min([parsedEnd, maxX]);

            if (adjustedStart >= adjustedEnd) {
                console.warn(`Adjusted date range out of bounds or invalid: ${adjustedStart} to ${adjustedEnd}`);
                return;
            }

            console.log(`Adjusted start: ${adjustedStart}, Adjusted end: ${adjustedEnd}`); // Log adjusted dates

            const xStart = xScale(adjustedStart);
            const xEnd = xScale(adjustedEnd);

            if (xStart < 0 || xEnd < 0) {
                console.warn(`Negative positions calculated: xStart = ${xStart}, xEnd = ${xEnd}`);
                return;
            }

            svg.append('rect')
                .attr('x', xStart)
                .attr('y', margin.top)
                .attr('width', xEnd - xStart)
                .attr('height', height)
                .attr('fill', color)
                .attr('opacity', 0.5)
                .attr('class', className)
                .attr('transform', `translate(${margin.left}, 0)`);
        };

        // Adding shaded areas for first pass and second pass
        if (showFirstPass && timeLineData.firstPass?.FreshmenStart && timeLineData.firstPass?.End) {
            addShadedArea(timeLineData.firstPass.FreshmenStart, timeLineData.firstPass.End, 'pink');
        }

        if (showSecondPass && timeLineData.secondPass?.FreshmenStart && timeLineData.secondPass?.End) {
            addShadedArea(timeLineData.secondPass.FreshmenStart, timeLineData.secondPass.End, 'skyblue');
        }

        const lineGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        lineGroup.selectAll(".line")
            .data(nestedData.filter(d => visibleLines[d.key]))
            .enter().append("path")
            .attr("class", "line")
            .attr("d", d => line(d.values))
            .style("stroke", d => colorScale(d.key))
            .style("fill", "none");

        // Define clip path
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // X-axis with class for updating in zoom
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
            .call(d3.axisBottom(xScale));

        // Y-axis with class for updating in zoom
        svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(yScale));

        // Title
        svg.append('text')
            .attr('x', width / 2 + margin.left)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .text(decodeCourse);

        // Source
        svg.append('text')
            .attr('x', width + margin.left)
            .attr('y', height + margin.top + margin.bottom)
            .attr('text-anchor', 'end')
            .style('font-size', '10px')
            .text('Date & Time');

        // Legend
        const legend = d3.select(legendRef.current);

        legend.selectAll('*').remove();

        const legendItems = legend.selectAll('.legend-item')
            .data(nestedData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', d => colorScale(d.key));

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .text(d => d.key)
            .style('font-size', '12px')
            .attr('alignment-baseline', 'middle');

        // Tooltip
        const tooltip = d3.select(tooltipRef.current)
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '10px')
            .style('border-radius', '5px');

        svg.on('mousemove', function (event) {
            const [mouseX, mouseY] = d3.pointer(event);
            const x0 = xScale.invert(mouseX - margin.left);
            const y0 = yScale.invert(mouseY - margin.top);

            const filteredData = nestedData.filter(d => visibleLines[d.key]);

            const tooltipData = filteredData.map(d => {
                const bisect = d3.bisector(d => d.time).left;
                const index = bisect(d.values, x0, 1);
                const a = d.values[index - 1];
                const b = d.values[index];

                if (!a || !b) {
                    return { key: d.key, value: 'N/A' };
                }

                const closestData = x0 - a.time > b.time - x0 ? b : a;
                return { key: d.key, value: closestData ? closestData.value : 'N/A' };
            });

            tooltip.html(
                tooltipData.map(d => `<strong>${d.key}:</strong> ${d.value}`).join('<br/>')
            )
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 20}px`)
                .style('visibility', 'visible');
        });

        svg.on('mouseout', function () {
            tooltip.style('visibility', 'hidden');
        });

        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom', (event) => {
                const newXScale = event.transform.rescaleX(xScale);
                const newYScale = event.transform.rescaleY(yScale);

                // Update the axes
                svg.select('.x-axis').call(d3.axisBottom(newXScale));
                svg.select('.y-axis').call(d3.axisLeft(newYScale));

                // Update the lines
                lineGroup.selectAll(".line")
                    .attr("d", d => line.x(d => newXScale(d.time)).y(d => newYScale(d.value))(d.values));

                // Update the shaded areas
                if (showFirstPass) {
                    svg.select('.shaded-area-first')
                        .attr('x', newXScale(parseTime(timeLineData.firstPass?.FreshmenStart)))
                        .attr('width', newXScale(parseTime(timeLineData.firstPass?.End)) - newXScale(parseTime(timeLineData.firstPass?.FreshmenStart)));
                }


                if (showSecondPass) {
                    svg.select('.shaded-area-second')
                        .attr('x', newXScale(parseTime(timeLineData.secondPass?.FreshmenStart)))
                        .attr('width', newXScale(parseTime(timeLineData.secondPass?.End)) - newXScale(parseTime(timeLineData.secondPass?.FreshmenStart)));
                }
            });

        svg.call(zoom);

    };
    return (
        <div className="App" style={{ backgroundColor: 'white' }}>

            <svg ref={svgRef} width={700} height={400}></svg>
            <svg ref={legendRef} className="legend"></svg>
            <div ref={tooltipRef} className="tooltip"></div>
        </div>
    );
}