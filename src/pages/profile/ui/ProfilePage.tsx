import styles from "./ProfilePage.module.css";
import { Footer, Sidebar } from "@/shared/ui";
import { Header } from "@/widgets/header";

export const ProfilePage = () => {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.pageInner}>
        <Header />
        <main>
          <section></section>
        </main>
        <Footer />
      </div>
    </div>
  );
};
