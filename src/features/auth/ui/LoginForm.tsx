"use client";
import styles from "./AuthForm.module.css";
import { AccentInput, PinkButton } from "@/shared/ui";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormValues,
  loginSchema,
} from "@/features/auth/model/loginSchema";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => console.log(data);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <AccentInput
        label={"E-Mail"}
        id={"email"}
        placeholder={"Enter Your E-Mail"}
        args={register("email")}
        error={errors.email?.message}
      />
      <AccentInput
        label={"Password"}
        id={"password"}
        placeholder={"Enter Password (minimum 8 characters)"}
        args={register("password")}
        type={"password"}
        error={errors.password?.message}
      />

      <PinkButton className={styles.formBtn}>Continue</PinkButton>
      <span className={styles.formText}>
        Dont have an Account?{" "}
        <Link className={styles.formLink} href={"/register"}>
          Sign in
        </Link>
      </span>
    </form>
  );
};
