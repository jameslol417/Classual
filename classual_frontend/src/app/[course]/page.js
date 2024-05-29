'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LineGraphComponent from '../components/LineGraphComponent';
import { IndependentGraphViewer } from "../components/GraphViewer";

export default function CoursePage() {
    const { course } = useParams();
    const [currentCourse, setCurrentCourse] = useState(course);
    const [selectedQuarter, setSelectedQuarter] = useState('[4]2023Fall');

    useEffect(() => {
        if (course) {
            setCurrentCourse(course);
        }
    }, [course, selectedQuarter]);

    if (!currentCourse) {
        return <div>Loading...</div>;
    }

    const handleQuarterChange = (event) => {
        setSelectedQuarter(event.target.value);
    };

    return (
        <div>
            <div>
                <label htmlFor="quarter-select">Select Quarter: </label>
                <select id="quarter-select" value={selectedQuarter} onChange={handleQuarterChange}>
                    <option value="[0]2022Spring">2022 Spring</option>
                    <option value="[1]2022Fall">2022 Fall</option>
                    <option value="[2]2023Winter">2023 Winter</option>
                    <option value="[3]2023Spring">2023 Spring</option>
                    <option value="[4]2023Fall">2023 Fall</option>
                    <option value="[5]2024Winter">2024 Winter</option>
                </select>
            </div>

            <LineGraphComponent course={currentCourse} quarter={selectedQuarter} />
            <IndependentGraphViewer courseCode={decodeURIComponent(course)} />
        </div>

    );
}