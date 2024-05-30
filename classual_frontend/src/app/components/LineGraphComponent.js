"use client";

import React, { useState, useRef, useEffect, useReducer } from "react";
import parseCSV from "../lib/processCSV";
import parseTimeLineData from "../lib/processTimeLine";
import styles from "../page.module.css";
import D3LineGraph from "./D3LineGraph";

import * as cache from "../utils/frontend-cache";

// Replace with Logo later
import Image from "next/image";
import Logo from "../../../public/Logo.png";

function LineGraphComponent({ course }) {
  const [data, setData] = useState([]);
  const decodeCourse = decodeURIComponent(course);
  const [timeLineData, setTimeLineData] = useState({});
  const [isCourseCSVavailable, setIsCourseCSVavailable] = useState(true);
  const [quarter, setQuarter] = useState("2023Fall");

  const [visibleLines, setVisibleLines] = useState({
    enrolledNumber: true,
    waitlistNumber: true,
    totalSeatNumber: true,
  });

  const [showFirstPass, setShowFirstPass] = useState(true);
  const [showSecondPass, setShowSecondPass] = useState(true);
  // TODO make the quarter be handled (drop down?) from the parent component [course]/page.js and pass it down here

  useEffect(() => {
    if (course) {
      fetchCourseAndProcess(course);
    }
  }, [course]);

  useEffect(() => {
    if (quarter) {
      fetchTimeLineData(quarter);
    }
  }, [quarter]);

  async function fetchCourseAndProcess(course) {
    try {
      const res = await fetch(`/api/fetchCSV?course=${course}`);
      if (!res.ok) {
        window.alert(
          `This course: ${decodeCourse}, is not Available at this quarter: ${quarter} `
        );
        setIsCourseCSVavailable(false);
        return;
      }
      const csv = await res.text();
      const formattedData = parseCSV(csv, course);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch or parse CSV data:", error);
    }
  }

  async function fetchTimeLineData(quarter) {
    try {
      const res = await fetch(`/api/fetchTimeLine?quarter=${quarter}`);
      const data = await res.json();
      const parsedData = parseTimeLineData(data);
      console.log("Time Parsed Data (parsedData):", parsedData);
      setTimeLineData(parsedData);
    } catch (error) {
      console.error("Failed to fetch time line data:", error);
    }
  }

  const handleToggleLine = (key) => {
    setVisibleLines((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleToggleFirstPass = () => {
    setShowFirstPass((prev) => !prev);
  };

  const handleToggleSecondPass = () => {
    setShowSecondPass((prev) => !prev);
  };

  return (
    <div>
      <div className = {styles.replaceLogo}>
        <Image src={Logo} alt="logo" width={400} height={100} />
      </div>
      <div className={styles.Quarter}>
        <label htmlFor="Quarter">Select Term: </label>
        <select name="Quarter" id="Quarter" className="selectQuarter">
          <option values="option1">Spring 2024</option>
          <option values="option2">Winter 2024</option>
          <option values="option3">Fall 2023</option>
          <option values="option4">Spring 2023</option>
        </select>
      </div>

      <div>
        <h1 className={styles.course_number}>DSC 140A</h1>
        <h2 className={styles.course_name}>Data Science (DS25)</h2>
        <div className={styles.shortenLine}>
          <hr class="styled-hr" />
        </div>
        <h3 className={styles.description}>
          The course covers learning and using probabilistic models for
          knowledge representation and decision-making. Topics covered include
          graphical models, temporal models, and online learning, as well as
          applications to natural language processing, adversarial learning,
          computational biology, and robotics. Prior completion of MATH 181A is
          strongly recommended.
        </h3>
        <div className = {styles.shortenLine2}>
          <hr class="styled-hr" />
        </div>
      </div>

      {isCourseCSVavailable ? (
        <div>
          <div className="dropdown">
            <label className={styles.checkBtn}>
              <input
                type="checkbox"
                checked={visibleLines.enrolledNumber}
                onChange={() => handleToggleLine("enrolledNumber")}
              />
              Enrolled
            </label>
            <label className={styles.checkBtn}>
              <input
                type="checkbox"
                checked={visibleLines.waitlistNumber}
                onChange={() => handleToggleLine("waitlistNumber")}
              />
              Waitlisted
            </label>
            <label className={styles.checkBtn}>
              <input
                type="checkbox"
                checked={visibleLines.totalSeatNumber}
                onChange={() => handleToggleLine("totalSeatNumber")}
              />
              Total
            </label>
            <label className={styles.checkBtn}>
              <input
                type="checkbox"
                checked={showFirstPass}
                onChange={handleToggleFirstPass}
              />
              First Pass
            </label>
            <label className={styles.checkBtn}>
              <input
                type="checkbox"
                checked={showSecondPass}
                onChange={handleToggleSecondPass}
              />
              Second Pass
            </label>
          </div>
          <D3LineGraph
            data={data}
            timeLineData={timeLineData}
            visibleLines={visibleLines}
            showFirstPass={showFirstPass}
            showSecondPass={showSecondPass}
            decodeCourse={decodeCourse}
          />
        </div>
      ) : (
        <div>Sorry! Course not available</div>
      )}
    </div>
  );
}

export default LineGraphComponent;
