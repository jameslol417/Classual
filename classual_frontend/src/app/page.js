import styles from "./page.module.css";

import MainSearch from "./components/MainSearch";
import CoursesByMajor from "./components/CoursesByMajor";

export default function Home() {


  return (
    <main className={styles.main}>

      <MainSearch />
      <CoursesByMajor />
    </main>
  );
}
