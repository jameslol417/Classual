'use client';

import React, { useState, useRef, useEffect, useReducer } from 'react';
import parseCSV from '../lib/processCSV';
import parseTimeLineData from '../lib/processTimeLine';
import styles from '../page.module.css';
import D3LineGraph from './D3LineGraph';

import * as cache from '../utils/frontend-cache';

function LineGraphComponent({ course }) {
    const [data, setData] = useState([]);
    const decodeCourse = decodeURIComponent(course);
    const [timeLineData, setTimeLineData] = useState({});
    const [isCourseCSVavailable, setIsCourseCSVavailable] = useState(true);
    const [quarter, setQuarter] = useState('2023Fall');

    const [visibleLines, setVisibleLines] = useState({
        enrolledNumber: true,
        waitlistNumber: true,
        totalSeatNumber: true,
    });

    const [showFirstPass, setShowFirstPass] = useState(true);
    const [showSecondPass, setShowSecondPass] = useState(true);
    // TODO make the quarter be handled (drop down?) from the parent component [course]/page.js and pass it down here

    useEffect(() => {
        if (course) {
            fetchCourseAndProcess(course);
        }
    }, [course]);

    useEffect(() => {
        if (quarter) {
            fetchTimeLineData(quarter);
        }
    }, [quarter]);

    async function fetchCourseAndProcess(course) {
        try {
            const res = await fetch(`/api/fetchCSV?course=${course}`);
            if (!res.ok) {
                window.alert(`This course: ${decodeCourse}, is not Available at this quarter: ${quarter} `);
                setIsCourseCSVavailable(false);
                return;
            }
            const csv = await res.text();
            const formattedData = parseCSV(csv, course);
            setData(formattedData);
        } catch (error) {
            console.error("Failed to fetch or parse CSV data:", error);
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
        <div>
            {isCourseCSVavailable ?
                (
                    <div>
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
                        <D3LineGraph
                            data={data}
                            timeLineData={timeLineData}
                            visibleLines={visibleLines}
                            showFirstPass={showFirstPass}
                            showSecondPass={showSecondPass}
                            decodeCourse={decodeCourse}
                        />
                    </div>
                )
                : <div>Sorry! Course not available</div>
            }
        </div>
    );
}

export default LineGraphComponent;