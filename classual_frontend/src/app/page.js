'use client'

import styles from "./page.module.css";
import MainSearch from "./components/MainSearch";
import CoursesByMajor from "./components/CoursesByMajor";
import { useState, useEffect } from 'react';

export default function Home() {
  const [courses, setCourses] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch('/api/fetchCourses');
      const data = await res.text();
      const parsedCourses = parseCourses(data);
      setCourses(parsedCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }

  function parseCourses(text) {
    const lines = text.split('\n');
    const coursesByMajor = {};

    lines.forEach((line) => {
      const [major, ...courseDetails] = line.split(' ');
      const course = line.trim();

      if (!coursesByMajor[major]) {
        coursesByMajor[major] = [];
      }

      coursesByMajor[major].push(course);
    });

    return coursesByMajor;
  }

  return (
    <main className={styles.main}>

      <MainSearch courses={courses} />
      <CoursesByMajor courses={courses} />
    </main>
  );
}
