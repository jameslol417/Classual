"use client";

import styles from "./page.module.css";
import MainSearch from "./components/MainSearch";
import Link from "next/link";
import CoursesByMajor from "./components/CoursesByMajor";
import { useState, useEffect } from "react";
import courseJson from "../../public/grouped_courses.json";
import mainLogo from "../../public/Logo.png";
import Image from "next/image";

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
    <main className={styles.main}>

      <Link className={styles.logo} href={"/"}>
        <Image src={mainLogo} alt="Classual Logo" width={400} height={100} />
      </Link>

      <MainSearch courses={courses} />
      <CoursesByMajor courses={courses} />
    </main>
  );
}
