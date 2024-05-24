'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DetailedCourse from '../components/DetailedCourse';
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
            <DetailedCourse course={currentCourse} />
            <IndependentGraphViewer courseCode={decodeURIComponent(course)} />
        </div>
    
        );
}