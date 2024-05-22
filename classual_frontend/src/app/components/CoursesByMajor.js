'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import styles from '../page.module.css';
import DropDownIcon from '../../../public/DropDownIcon.png';

function CoursesByMajor({ courses }) {
    const [isOpen, setIsOpen] = useState({});

    function toggledMajor(major) {
        setIsOpen((prev) => ({
            ...prev,
            [major]: !prev[major],
        }));
    };

    return (
        <div className={styles.coursesMajorContainer}>
            <div className={styles.bottomIndicatorText}>
                Courses By Major
            </div>

            <div className={styles.majorAndClassContainer}>
                {Object.entries(courses).map(([major, courseList]) => (
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
                                {courseList.map((course, index) => (
                                    <Link key={index} href={`/${course}`} className={styles.classText}>
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