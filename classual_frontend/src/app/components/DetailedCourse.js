'use client'

import { useEffect, useState } from 'react';
import parseCSV from '../lib/processCSV';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// TODOS each quarter repo's Readme.md have information about time line of first pass, second pass, new student enrollment.
function DetailedCourse({ course }) {
    const [data, setData] = useState([]);
    const decodeCourse = decodeURIComponent(course);

    useEffect(() => {
        if (course) {
            fetch_and_process(course);
        }
    }, [course]);

    async function fetch_and_process(course) {
        try {
            const res = await fetch(`/api/fetchCSV?course=${course}`);
            const csv = await res.text();
            const formattedData = parseCSV(csv, course);
            setData(formattedData);
        } catch (error) {
            console.error("Failed to fetch and parse CSV data:", error);
        }
    }

    return (
        <div>
            <h1>{decodeCourse}</h1>

            <div></div>

            <LineChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="enrolledNumber" stroke="#8884d8" />
                <Line type="monotone" dataKey="waitlistNumber" stroke="#82ca9d" />
                <Line type="monotone" dataKey="totalSeatNumber" stroke="#8536d3" />
            </LineChart>
        </div>
    )
}

export default DetailedCourse;