"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";
import DropDownIcon from "../../../public/dropdownIcon.png";


function CoursesByMajor({ courses }) {
  const [isOpen, setIsOpen] = useState({});

  function toggleLetter(letter) {
    setIsOpen(prev => ({
      ...prev,
      [letter]: !prev[letter]
    }));
  }

  const alphabetCategorized = Object.entries(courses).reduce((acc, [major, courseList]) => {
    const firstLetter = major[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({ major, courseList });
    return acc;
  }, {});

  const sortedCategories = Object.keys(alphabetCategorized).sort().map(letter => ({
    letter,
    majors: alphabetCategorized[letter].sort((a, b) => a.major.localeCompare(b.major))
  }));

  return (
    <div className={styles.coursesMajorContainer}>
      <div className={styles.bottomIndicatorText}>Courses By Major</div>

      <div className={styles.majorAndClassContainer}>
        {sortedCategories.map(({ letter, majors }) => (
          <div key={letter}>
            <div
              className={styles.majorText}
              onClick={() => toggleLetter(letter)}
            >
              {letter}
              <Image src={DropDownIcon} alt="Expand" width={30} height={30} />
            </div>

            {isOpen[letter] && (
              <div className = {styles.majorList}>
                {majors.map(({ major, courseList }, index) => (
                  <div key={index}>
                    <h3 onClick={() => setIsOpen(prev => ({
                      ...prev,
                      [major]: !prev[major]
                    }))}>
                      {major}
                      <Image src={DropDownIcon} alt="Expand" width={20} height={20} />
                    </h3>
                    {isOpen[major] && (
                      <div>
                        <ul className={styles.courseRow}>
                          {courseList.sort().map((course, i) => (
                            <li key={i}>
                              <Link
                                href={`/${course}`}
                                className={styles.classText}
                              >
                                {course}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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