'use client'

import { useEffect } from 'react';
import fetchExampleCSV from '../lib/fetched_process';


function DetailedCourse() {

    useEffect(() => {
        fetchExampleCSV();
    }, [])

    return (
        <div>
            Hi I'm detailedCourse and this will be filled with graphics.
        </div>
    )
}

export default DetailedCourse;