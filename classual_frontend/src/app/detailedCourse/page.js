'use client'

import { useEffect, useState, useReducer } from 'react';
// import fetchExampleCSV from '../lib/fetched_process';
import fetchCsv from '../lib/fetched_process';
import {treeReducer} from '../components/graphing/treeReducer'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';




function DetailedCourse() {
    const [data, setData] = useState([]);
    const [state, dispatch] = useReducer(treeReducer, null);
    const json = require('./courses.json');

    useEffect(() => {
        fetchData();
        console.log(data)
    }, []);

    async function fetchData() {
        try {
            const formattedData = await fetchCsv();
            setData(formattedData); // Set the parsed data
            console.log("data length:", formattedData.length);
        } catch (error) {
            console.error("Failed to fetch and parse CSV data:", error);
        }
    }

    useEffect(() => {
        // initialize the graph
        async function loadGraph() {
          const rootNode = await makeGraph(root);
        // call treeReducer
        //   dispatch({ type: "initialize", payload: rootNode });
        }
        loadGraph();
      }, [root]);

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
            </LineChart>
        </div>
    )
}

export default DetailedCourse;