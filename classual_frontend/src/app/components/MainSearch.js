'use client'

import Image from 'next/image';
import { useEffect, useState } from "react";
import styles from '../page.module.css';
import searchIcon from '../../../public/searchIcon.png'
import Link from 'next/link';


function MainSearch({ courses }) {
    const [searchTerm, setSerachTerm] = useState('');
    const allCourses = Object.values(courses).flat();
    const filteredCourse = allCourses.filter(course => course.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);

    function searchClicked() {
        console.log("searching for: ", searchTerm);
        setSerachTerm(searchTerm);
    }

    return (
        <div className={styles.topContainer}>

            <div className={styles.titleTxt}>
                UCSD Classual (Class + Visual)
            </div>

            <div className={styles.searchContainer}>
                <div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSerachTerm(e.target.value)}
                        placeholder="Search for your course!"
                        className={styles.searchInput}
                    />

                    <div className={styles.searchResults}>
                        {searchTerm && filteredCourse.map((course, index) => (
                            <Link key={index} href={`/${course}`} className={styles.searchResultItem}>
                                {course}
                            </Link>
                        ))}
                    </div>
                </div>


                <button
                    onClick={() => console.log("searching for:", searchTerm)}
                    className={styles.searchButton}
                >
                    <Image
                        src={searchIcon}
                        alt="Search Button"
                        width={30}
                        height={30}
                        className={styles.imageStyle}
                    />
                </button>

            </div>

        </div>
    )

}

export default MainSearch;