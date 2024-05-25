'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LineGraphComponent from '../components/LineGraphComponent';
import { IndependentGraphViewer } from "../components/GraphViewer";

export default function CoursePage() {
    const { course } = useParams();
    const [currentCourse, setCurrentCourse] = useState(course);

    useEffect(() => {
        if (course) {
            setCurrentCourse(course);
        }
    }, [course]);

    if (!currentCourse) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <LineGraphComponent course={currentCourse} />
            <IndependentGraphViewer courseCode={decodeURIComponent(course)} />
        </div>

    );
}