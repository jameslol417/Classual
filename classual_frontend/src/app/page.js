"use client";

import styles from "./page.module.css";
import MainSearch from "./components/MainSearch";
import CoursesByMajor from "./components/CoursesByMajor";
import { useState, useEffect } from "react";
import courseJson from "../../public/grouped_courses.json";

export default function Home() {
  const [courses, setCourses] = useState({});

  useEffect(() => {
    fetchCoursesJson();
  }, []);

  async function fetchCoursesJson() {
    try {
      const data = courseJson;
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch json courses:", error.message);
    }
  }

  return (
    <div>
      <MainSearch courses={courses} />
      <CoursesByMajor courses={courses} />
    </div>
  );
}
