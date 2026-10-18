import { AuthLayout } from "@/app/layouts/AuthLayout/AuthLayout";

export default function AuthLayoutPage({ children }: LayoutProps<"/">) {
  return <AuthLayout>{children}</AuthLayout>;
}
