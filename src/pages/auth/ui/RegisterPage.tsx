import styles from "./AuthPage.module.css";
import { RegisterForm } from "@/features/auth";

export const RegisterPage = () => {
  return (
    <>
      <h1 className={styles.title}>Sign Up</h1>
      <RegisterForm />
    </>
  );
};
