import styles from "./RegisterSuccessfullyPage.module.css";
import { PinkButton } from "@/shared/ui";

export const RegisterSuccessfullyPage = () => {
  return (
    <>
      <h1 className={styles.title}>Registration is Successful 🎉</h1>
      <p className={styles.desc}>Your account has been successfully Created!</p>
      <PinkButton href={"/login"} className={styles.btn}>
        Log in to your account
      </PinkButton>
    </>
  );
};
