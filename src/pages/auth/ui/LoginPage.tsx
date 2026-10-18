import styles from "./AuthPage.module.css";
import { LoginForm } from "@/features/auth";

export const LoginPage = () => {
  return (
    <>
      <h1 className={styles.title}>Authorization</h1>
      <LoginForm />
    </>
  );
};
