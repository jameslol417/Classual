'use client'

import Image from 'next/image';
import { useEffect, useState } from "react";
import styles from '../page.module.css';
import searchIcon from '../../../public/searchIcon.png'


function MainSearch() {
    const [searchCourse, setSearchCourse] = useState('');

    // TODOS need to implement search algorithm: 
    // pull all the list of courses in a list and list up to 5 that matches

    function searchClicked() {
        console.log("searching for: ", searchCourse);
    }

    return (
        <div className={styles.topContainer}>

            <div className={styles.titleTxt}>
                UCSD Classual (Class + Visual)
            </div>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchCourse}
                    onChange={(e) => setSearchCourse(e.target.value)}
                    placeholder="Search for your course!"
                    className={styles.searchInput}
                />
                <button
                    onClick={searchClicked}
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