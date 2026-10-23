import styles from "./MainLayout.module.css";
import { Footer, Sidebar } from "@/shared/ui";
import { Header } from "@/widgets/header";
import { ReactNode } from "react";
import { Player } from "@/widgets/player";

interface MainLayoutProps {
  isIntro?: boolean;
  children: ReactNode;
}

export const MainLayout = ({ children, isIntro = false }: MainLayoutProps) => {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.pageInner}>
        <Header isIntro={isIntro} />
        <main>{children}</main>
        <Player />
        <Footer />
      </div>
    </div>
  );
};
