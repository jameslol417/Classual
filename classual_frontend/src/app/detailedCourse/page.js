'use client'

import { useEffect, useState } from 'react';
import { parseCSV } from '../lib/processCSV';
import fetchCSV from '../../pages/api/fetchCSV';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


function DetailedCourse() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
        console.log(data)
    }, []);

    async function fetchData() {
        try {
            const csv = await fetchCSV();
            const formattedData = parseCSV(csv);
            setData(formattedData);
            console.log("data length:", formattedData.length);
        } catch (error) {
            console.error("Failed to fetch and parse CSV data:", error);
        }
    }

    return (
        <div>
            <div>Hi I'm detailedCourse and this will be filled with graphics.</div>
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