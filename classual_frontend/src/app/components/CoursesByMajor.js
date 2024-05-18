'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import styles from '../page.module.css';
import DropDownIcon from '../../../public/DropDownIcon.png';

function CoursesByMajor() {
    const [isOpen, setIsOpen] = useState({});
    const [majors, setMajors] = useState({});

    function toggledMajor(major) {
        setIsOpen((prev) => ({
            ...prev,
            [major]: !prev[major],
        }));
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            const res = await fetch('/api/fetchCourses');
            const textData = await res.text();
            const parsedText = parseCourses(textData);
            setMajors(parsedText);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        }
    }

    function parseCourses(text) {
        const lines = text.split('\n');
        const coursesByMajor = {};

        lines.forEach((line) => {
            const [major, courseNumbers] = line.split(' ');
            const course = line.trim();

            if (!coursesByMajor[major]) {
                coursesByMajor[major] = [];
            }

            coursesByMajor[major].push(course);
        });

        return coursesByMajor;
    }

    return (
        <div className={styles.coursesMajorContainer}>
            <div className={styles.bottomIndicatorText}>
                Courses By Major
            </div>

            <div className={styles.majorAndClassContainer}>
                {Object.entries(majors).map(([major, courses]) => (
                    <div key={major}>
                        <div className={styles.majorText} onClick={() => toggledMajor(major)}>
                            {major}
                            <Image
                                src={DropDownIcon}
                                alt='Expand'
                                width={30}
                                height={30}
                            />
                        </div>

                        {isOpen[major] && (
                            <div>
                                {courses.map((course) => (
                                    <Link key={course} href={`/${course}`} className={styles.classText}>
                                        {course}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

            </div>

        </div>
    );
}

export default CoursesByMajor;