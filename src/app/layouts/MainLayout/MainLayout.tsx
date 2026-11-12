import styles from "./MainLayout.module.css";
import { Footer, Sidebar } from "@/shared/ui";
import { Header } from "@/widgets/header";
import { ReactNode } from "react";
import { Player } from "@/widgets/player";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.pageInner}>
        <Header />
        <main>{children}</main>
        <Player />
        <Footer />
      </div>
    </div>
  );
};
