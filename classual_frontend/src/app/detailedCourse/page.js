'use client'

import { useEffect, useState, useReducer } from 'react';
// import fetchExampleCSV from '../lib/fetched_process';
import fetchCsv from '../lib/fetched_process';
import treeReducer from '../components/graphing/treeReducer';
import makeGraph from '../components/graphing/CourseTree';
import * as cache from '../components/graphing/cache';
import { getCourse } from '../components/graphing/cache';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';




function DetailedCourse() {
    const [data, setData] = useState([]);
    const [state, dispatch] = useReducer(treeReducer, null);
    const [course, setCourse] = useState([]);

    // useEffect(() => {
    //     fetch('/courses/CSE_12.json')
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             setCourse(data);
    //             console.log('Fetched course data:', data); // Debugging: log the fetched data
    //         })
    //         .catch(error => console.error('Error fetching courses:', error));
    // }, []);

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
            const course = await cache.getCourse("CSE 12");
            const rootNode = await makeGraph(course);
            // call treeReducer
            dispatch({ type: "initialize", payload: rootNode });
        }
        loadGraph();
    }, [course]);

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