"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LineGraphComponent from "../components/LineGraphComponent";
import { IndependentGraphViewer } from "../components/GraphViewer";
import courseDescriptionTSV from "../../../public/courses.tsv";
import Papa from "papaparse";
import styles from "./page.module.css";
import { jua } from "../fonts.js";

export default function CoursePage() {
  const { course } = useParams();
  const [currentCourse, setCurrentCourse] = useState(course);
  const decodeCourse = decodeURIComponent(course);
  // Default selected Course is 2023 Fall
  const [selectedQuarter, setSelectedQuarter] = useState("[4]2023Fall");

  const [courseData, setCourseData] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);

  useEffect(() => {
    parseCourseDescriontion();
  }, []);

  async function parseCourseDescriontion() {
    try {
      const courseDescription = courseDescriptionTSV;
      const jsonData = Papa.parse(courseDescription, {
        header: true,
        skipEmptyLines: true,
        delimiter: "\t",
      }).data;
      setCourseData(jsonData);
    } catch (error) {
      console.error("Failed to fetch json courses:", error.message);
    }
  }

  useEffect(() => {
    if (courseData.length > 0) {
      const details = findCourseDescription(decodeCourse);
      setCourseDetails(details);
    }
  }, [decodeCourse, courseData]);

  function findCourseDescription(courseCode) {
    const course = courseData.find(
      (course) => course.course_number === courseCode
    );
    return course;
  }

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

      <div className={styles.columnFlex}>
        <div className={styles.horizontalLine}>
        </div>

        <div className={`${styles.courseCode} ${jua.className}`}>
          Course Code: {decodeCourse}
        </div>
        <div className={styles.course_name}>
          Course Name: {courseDetails?.course_name}
        </div>
        <div className={styles.h3}>
          Units: {courseDetails?.units}
        </div>
        <div className={styles.h3}>
          Description: {courseDetails?.description}
        </div>

        <div className={styles.horizontalLine}>
        </div>

      </div>


      <div className={styles.Quarter}>
        <label htmlFor="quarter-select">Select Quarter: </label>
        <select
          id="quarter-select"
          value={selectedQuarter}
          onChange={handleQuarterChange}
        >
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
