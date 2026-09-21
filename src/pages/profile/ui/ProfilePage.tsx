import styles from "./ProfilePage.module.css";
import { Sidebar } from "@/shared/ui";
import { Header } from "@/widgets/header/ui/Header";

export const ProfilePage = () => {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.pageInner}>
        <Header />
        <main>
          <section></section>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};
