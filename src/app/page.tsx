import { MainLayout } from "@/components/layouts/MainLayout/MainLayout";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
        <MainLayout/>
    </div>
  );
}
