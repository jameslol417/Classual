'use client'

import { useState } from 'react';
import Image from "next/image";
import styles from '../page.module.css';
import DropDownIcon from '../../../public/DropDownIcon.png';

function CoursesByMajor() {
    const [isOpen, setIsOpen] = useState(false);

    function toggledMajor() {
        setIsOpen(!isOpen);
    }

    return (
        <div className={styles.coursesMajorContainer}>
            <div className={styles.bottomIndicatorText}>
                Courses By Major
            </div>

            <div className={styles.majorAndClassContainer}>
                <div className={styles.majorText} onClick={toggledMajor}>
                    Major1
                    <Image
                        src={DropDownIcon}
                        alt='Expand'
                        width={30}
                        height={30}
                    />
                </div>

                {isOpen && (
                    <div>
                        <div className={styles.classText}>
                            class1
                        </div>
                        <div className={styles.classText}>
                            class2
                        </div>
                        <div className={styles.classText}>
                            class3
                        </div>
                        <div className={styles.classText}>
                            class3
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

export default CoursesByMajor;