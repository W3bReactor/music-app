"use client";
import styles from "./AuthForm.module.css";
import { AccentSelect, PinkButton } from "@/shared/ui";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { AccentInput } from "@/shared/ui/AccentInput/AccentInput";
import {
  RegisterFormValues,
  registerSchema,
} from "@/features/auth/model/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const role = watch("role");

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) =>
    console.log(data);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <AccentInput
        label={"Full name"}
        id={"name"}
        placeholder={"Enter Your Name"}
        args={register("name")}
        error={errors.name?.message}
      />
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
      <AccentSelect
        error={errors.role?.message}
        args={register("role")}
        label={"Role"}
        id={"role"}
        currentValue={role}
      />
      <PinkButton className={styles.formBtn}>Register</PinkButton>
      <span className={styles.formText}>
        Already have an account?{" "}
        <Link className={styles.formLink} href={"/login"}>
          Log in
        </Link>
      </span>
    </form>
  );
};
