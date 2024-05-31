import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function D3LineGraph({ data, timeLineData, visibleLines, decodeCourse }) {
    const svgRef = useRef();
    const legendRef = useRef();
    const tooltipRef = useRef();
    
    const [checked, setChecked] = useState({
        showFirstPass: false,
        showSecondPass: false,
        showPriorities: false,
        showSeniors: false,
        showJuniors: false,
        showSophomores: false,
        showFreshmen: false,
        showTransfers: false,
        showNewStudents: false,
    });

    useEffect(() => {
        if (data.length > 0 && Object.keys(timeLineData).length > 0) {
            drawChart();
        }
    }, [data, visibleLines, checked, timeLineData]);

    const handleCheckboxChange = (event) => {
        setChecked({ ...checked, [event.target.name]: event.target.checked });
    };

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

        const xScale = d3.scaleTime()
            .domain(dataExtent)
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.enrolledNumber, d.waitlistNumber, d.totalSeatNumber))])
            .nice()
            .range([height, 0]);

        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value));

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(['enrolledNumber', 'waitlistNumber', 'totalSeatNumber']);

        const nestedData = colorScale.domain().map(key => ({
            key,
            values: data.map(d => ({
                time: parseTime(d.time),
                value: +d[key]
            }))
        }));

        const addShadedArea = (start, end, color, className) => {
            const parsedStart = parseTime(start);
            const parsedEnd = parseTime(end);
            if (!parsedStart || !parsedEnd) return;

            const xStart = xScale(parsedStart);
            const xEnd = xScale(parsedEnd);

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

        if (checked.showFirstPass && timeLineData.firstPass?.FreshmenStart && timeLineData.firstPass?.End) {
            addShadedArea(timeLineData.firstPass.FreshmenStart, timeLineData.firstPass.End, 'pink', 'shaded-area-first');
        }

        if (checked.showSecondPass && timeLineData.secondPass?.FreshmenStart && timeLineData.secondPass?.End) {
            addShadedArea(timeLineData.secondPass.FreshmenStart, timeLineData.secondPass.End, 'skyblue', 'shaded-area-second');
        }

        // Additional shaded areas based on the checkbox state
        if (checked.showPriorities && timeLineData.firstPass?.PrioritiesStart && timeLineData.firstPass?.End) {
            addShadedArea(timeLineData.firstPass.PrioritiesStart, timeLineData.firstPass.End, '#e06d34', 'shaded-area-priorities');
        }

        if (checked.showSeniors && timeLineData.firstPass?.SeniorsStart && timeLineData.firstPass?.End) {
            addShadedArea(timeLineData.firstPass.SeniorsStart, timeLineData.firstPass.End, '#42cf1b', 'shaded-area-seniors');
        }

        if (checked.showJuniors && timeLineData.firstPass?.JuniorsStart && timeLineData.firstPass?.End) {
            addShadedArea(timeLineData.firstPass.JuniorsStart, timeLineData.firstPass.End, '#11c7d1', 'shaded-area-juniors');
        }

        if (checked.showSophomores && timeLineData.firstPass?.SophomoresStart && timeLineData.firstPass?.End) {
            addShadedArea(timeLineData.firstPass.SophomoresStart, timeLineData.firstPass.End, '#6a26d1', 'shaded-area-sophomores');
        }

        if (checked.showFreshmen && timeLineData.firstPass?.FreshmenStart && timeLineData.firstPass?.End) {
            addShadedArea(timeLineData.firstPass.FreshmenStart, timeLineData.firstPass.End, '#e0e342', 'shaded-area-freshmen');
        }

        if (checked.showTransfers && timeLineData.quarterStart?.NewTransfersStart && timeLineData.quarterStart?.End) {
            addShadedArea(timeLineData.quarterStart.NewTransfersStart, timeLineData.quarterStart.End, '#e06d34', 'shaded-area-transfers');
        }

        if (checked.showNewStudents && timeLineData.quarterStart?.NewStudentsStart && timeLineData.quarterStart?.End) {
            addShadedArea(timeLineData.quarterStart.NewStudentsStart, timeLineData.quarterStart.End, '#42cf1b', 'shaded-area-newstudents');
        }

        // Define clip path
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        const lineGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr('clip-path', 'url(#clip)');

        lineGroup.selectAll(".line")
            .data(nestedData.filter(d => visibleLines[d.key]))
            .enter().append("path")
            .attr("class", "line")
            .attr("d", d => line(d.values))
            .style("stroke", d => colorScale(d.key))
            .style("fill", "none");

        // X-axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
            .call(d3.axisBottom(xScale));

        // Y-axis
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

                if (!a || !b) return { key: d.key, value: 'N/A' };

                const closestData = x0 - a.time > b.time - x0 ? b : a;
                return { key: d.key, value: closestData.value };
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

                svg.select('.x-axis').call(d3.axisBottom(newXScale));
                svg.select('.y-axis').call(d3.axisLeft(newYScale));

                lineGroup.selectAll(".line")
                    .attr("d", d => line.x(d => newXScale(d.time)).y(d => newYScale(d.value))(d.values));

                // Update the shaded areas
                if (checked.showFirstPass && timeLineData.firstPass?.FreshmenStart && timeLineData.firstPass?.End) {
                    svg.select('.shaded-area-first')
                        .attr('x', newXScale(parseTime(timeLineData.firstPass.FreshmenStart)))
                        .attr('width', newXScale(parseTime(timeLineData.firstPass.End)) - newXScale(parseTime(timeLineData.firstPass.FreshmenStart)));
                }

                if (checked.showSecondPass && timeLineData.secondPass?.FreshmenStart && timeLineData.secondPass?.End) {
                    svg.select('.shaded-area-second')
                        .attr('x', newXScale(parseTime(timeLineData.secondPass.FreshmenStart)))
                        .attr('width', newXScale(parseTime(timeLineData.secondPass.End)) - newXScale(parseTime(timeLineData.secondPass.FreshmenStart)));
                }

                if (checked.showPriorities && timeLineData.firstPass?.PrioritiesStart && timeLineData.firstPass?.End) {
                    svg.select('.shaded-area-priorities')
                        .attr('x', newXScale(parseTime(timeLineData.firstPass.PrioritiesStart)))
                        .attr('width', newXScale(parseTime(timeLineData.firstPass.End)) - newXScale(parseTime(timeLineData.firstPass.PrioritiesStart)));
                }

                if (checked.showSeniors && timeLineData.firstPass?.SeniorsStart && timeLineData.firstPass?.End) {
                    svg.select('.shaded-area-seniors')
                        .attr('x', newXScale(parseTime(timeLineData.firstPass.SeniorsStart)))
                        .attr('width', newXScale(parseTime(timeLineData.firstPass.End)) - newXScale(parseTime(timeLineData.firstPass.SeniorsStart)));
                }

                if (checked.showJuniors && timeLineData.firstPass?.JuniorsStart && timeLineData.firstPass?.End) {
                    svg.select('.shaded-area-juniors')
                        .attr('x', newXScale(parseTime(timeLineData.firstPass.JuniorsStart)))
                        .attr('width', newXScale(parseTime(timeLineData.firstPass.End)) - newXScale(parseTime(timeLineData.firstPass.JuniorsStart)));
                }

                if (checked.showSophomores && timeLineData.firstPass?.SophomoresStart && timeLineData.firstPass?.End) {
                    svg.select('.shaded-area-sophomores')
                        .attr('x', newXScale(parseTime(timeLineData.firstPass.SophomoresStart)))
                        .attr('width', newXScale(parseTime(timeLineData.firstPass.End)) - newXScale(parseTime(timeLineData.firstPass.SophomoresStart)));
                }

                if (checked.showFreshmen && timeLineData.firstPass?.FreshmenStart && timeLineData.firstPass?.End) {
                    svg.select('.shaded-area-freshmen')
                        .attr('x', newXScale(parseTime(timeLineData.firstPass.FreshmenStart)))
                        .attr('width', newXScale(parseTime(timeLineData.firstPass.End)) - newXScale(parseTime(timeLineData.firstPass.FreshmenStart)));
                }

                if (checked.showTransfers && timeLineData.quarterStart?.NewTransfersStart && timeLineData.quarterStart?.End) {
                    svg.select('.shaded-area-transfers')
                        .attr('x', newXScale(parseTime(timeLineData.quarterStart.NewTransfersStart)))
                        .attr('width', newXScale(parseTime(timeLineData.quarterStart.End)) - newXScale(parseTime(timeLineData.quarterStart.NewTransfersStart)));
                }

                if (checked.showNewStudents && timeLineData.quarterStart?.NewStudentsStart && timeLineData.quarterStart?.End) {
                    svg.select('.shaded-area-newstudents')
                        .attr('x', newXScale(parseTime(timeLineData.quarterStart.NewStudentsStart)))
                        .attr('width', newXScale(parseTime(timeLineData.quarterStart.End)) - newXScale(parseTime(timeLineData.quarterStart.NewStudentsStart)));
                }
            });

        svg.call(zoom);
    };

    return (
        <div className="App" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
                <svg ref={svgRef} width={700} height={400}></svg>
                <svg ref={legendRef} className="legend"></svg>
                <div ref={tooltipRef} className="tooltip"></div>
            </div>
            <div className="checkboxes" style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                <label>
                    <input
                        type="checkbox"
                        name="showFirstPass"
                        checked={checked.showFirstPass}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show First Pass
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showSecondPass"
                        checked={checked.showSecondPass}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show Second Pass
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showPriorities"
                        checked={checked.showPriorities}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show Priorities
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showSeniors"
                        checked={checked.showSeniors}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show Seniors
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showJuniors"
                        checked={checked.showJuniors}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show Juniors
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showSophomores"
                        checked={checked.showSophomores}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show Sophomores
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showFreshmen"
                        checked={checked.showFreshmen}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show Freshmen
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showTransfers"
                        checked={checked.showTransfers}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show Transfers
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showNewStudents"
                        checked={checked.showNewStudents}
                        onChange={handleCheckboxChange}
                        style={{ marginRight: '5px' }}
                    /> Show New Students
                </label>
            </div>
        </div>
    );
}
