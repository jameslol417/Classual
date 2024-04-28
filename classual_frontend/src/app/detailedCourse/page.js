'use client'

import { useEffect } from 'react';
// import fetchExampleCSV from '../lib/fetched_process';
import fetchCsv from '../lib/fetched_process';
import Papa from 'papaparse';

async function GetData(artist) {
    const data = Papa.parse(await fetchCsv());
    console.log(data);
    return data;
}


function DetailedCourse() {

    useEffect(() => {
        GetData();
    }, [])

    return (
        <div>
            Hi I'm detailedCourse and this will be filled with graphics.
        </div>
    )
}

export default DetailedCourse;