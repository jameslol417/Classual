'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import parseCSV from '../lib/processCSV';
import parseTimeLineData from '../lib/processTimeLine';
import styles from '../page.module.css';

// const firstPassStart = timeLineData.firstPass.FreshmenStart;
// const firstPassEnd = '2023-07-16';

// const secondPassStart = '2023-08-12';
// const secondPassEnd = "2023-09-12";

function DetailedCourse({ course }) {
    const [data, setData] = useState([]);
    const decodeCourse = decodeURIComponent(course);
    const [timeLineData, setTimeLineData] = useState({});
    const [quarter, setQuarter] = useState('2023Fall');


    const [visibleLines, setVisibleLines] = useState({
        enrolledNumber: true,
        waitlistNumber: true,
        totalSeatNumber: true,
    });

    const [showFirstPass, setShowFirstPass] = useState(true);
    const [showSecondPass, setShowSecondPass] = useState(true);

    const svgRef = useRef();
    const legendRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        if (course) {
            fetchCourseAndProcess(course);
        }
    }, [course]);

    useEffect(() => {
        if (quarter) {
            fetchTimeLineData(quarter);
            console.log("timeLine DATA:: ", timeLineData);
        }
    }, [quarter]);

    async function fetchCourseAndProcess(course) {
        try {
            const res = await fetch(`/api/fetchCSV?course=${course}`);
            const csv = await res.text();
            const formattedData = parseCSV(csv, course);
            setData(formattedData);
        } catch (error) {
            console.error("Failed to fetch and parse CSV data:", error);
        }
    }

    async function fetchTimeLineData(quarter) {
        try {
            const res = await fetch(`/api/fetchTimeLine?quarter=${quarter}`);
            const data = await res.json();
            const parsedData = parseTimeLineData(data);
            console.log('Time Parsed Data (parsedData):', parsedData);
            setTimeLineData(parsedData);
        } catch (error) {
            console.error("Failed to fetch time line data:", error);
        }
    }

    useEffect(() => {
        if (data.length > 0) {
            drawChart();
        }
    }, [data, visibleLines, showFirstPass, showSecondPass]);

    const drawChart = () => {
        const svg = d3.select(svgRef.current)
            .attr('style', 'background: white;');

        const margin = { top: 120, right: 40, bottom: 40, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        svg.selectAll('*').remove();

        const parseTime = d3.timeParse('%Y-%m-%d');
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => parseTime(d.time)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.enrolledNumber, d.waitlistNumber, d.totalSeatNumber))])
            .nice()
            .range([height, 0]);

        const line = d3.line()
            .x(d => xScale(parseTime(d.time)))
            .y(d => yScale(d.value));

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(['enrolledNumber', 'waitlistNumber', 'totalSeatNumber', 'FirstPass', 'Second Pass']);

        const nestedData = colorScale.domain().map(key => ({
            key,
            values: data.map(d => ({ time: parseTime(d.time), value: +d[key] }))
        }));


        if (showFirstPass) {
            svg.append('rect')
                .attr('class', 'shaded-area-first')
                .attr('x', xScale(parseTime(firstPassStart)))
                .attr('y', 0)
                .attr('width', xScale(parseTime(firstPassEnd)) - xScale(parseTime(firstPassStart)))
                .attr('height', height)
                .attr('fill', 'pink')
                .attr('opacity', 0.5)
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
        }

        if (showSecondPass) {
            svg.append('rect')
                .attr('class', 'shaded-area-second')
                .attr('x', xScale(parseTime(secondPassStart)))
                .attr('y', 0)
                .attr('width', xScale(parseTime(secondPassEnd)) - xScale(parseTime(secondPassStart)))
                .attr('height', height)
                .attr('fill', 'skyblue')
                .attr('opacity', 0.5)
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
        }

        const lineGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr("clip-path", "url(#clip)"); // Clip path to keep lines within axes

        if (nestedData[0].values[0].time) {
            lineGroup.selectAll(".line")
                .data(nestedData.filter(d => visibleLines[d.key]))
                .enter().append("path")
                .attr("class", "line")
                .attr("d", d => line(d.values))
                .style("stroke", d => colorScale(d.key))
                .style("fill", "none"); // Ensure no fill color is applied
        }

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
                        .attr('x', newXScale(parseTime(firstPassStart)))
                        .attr('width', newXScale(parseTime(firstPassEnd)) - newXScale(parseTime(firstPassStart)));
                }

                if (showSecondPass) {
                    svg.select('.shaded-area-second')
                        .attr('x', newXScale(parseTime(secondPassStart)))
                        .attr('width', newXScale(parseTime(secondPassEnd)) - newXScale(parseTime(secondPassStart)));
                }
            });

        svg.call(zoom);
    };

    const handleToggleLine = (key) => {
        setVisibleLines(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

    const handleToggleFirstPass = () => {
        setShowFirstPass(prev => !prev);
    };

    const handleToggleSecondPass = () => {
        setShowSecondPass(prev => !prev);
    };

    return (
        <div className="App" style={{ backgroundColor: 'white' }}>
            <div className="dropdown">
                <label className={styles.checkBtn}>
                    <input
                        type="checkbox"
                        checked={visibleLines.enrolledNumber}
                        onChange={() => handleToggleLine('enrolledNumber')}
                    />
                    Enrolled
                </label>
                <label className={styles.checkBtn}>
                    <input
                        type="checkbox"
                        checked={visibleLines.waitlistNumber}
                        onChange={() => handleToggleLine('waitlistNumber')}
                    />
                    Waitlisted
                </label>
                <label className={styles.checkBtn}>
                    <input
                        type="checkbox"
                        checked={visibleLines.totalSeatNumber}
                        onChange={() => handleToggleLine('totalSeatNumber')}
                    />
                    Total
                </label>
                <label className={styles.checkBtn}>
                    <input
                        type="checkbox"
                        checked={showFirstPass}
                        onChange={handleToggleFirstPass}
                    />
                    First Pass
                </label>
                <label className={styles.checkBtn}>
                    <input
                        type="checkbox"
                        checked={showSecondPass}
                        onChange={handleToggleSecondPass}
                    />
                    Second Pass
                </label>
            </div>
            <svg ref={svgRef} width={700} height={400}></svg>
            <svg ref={legendRef} className="legend"></svg>
            <div ref={tooltipRef} className="tooltip"></div>
        </div>
    );
}

export default DetailedCourse;