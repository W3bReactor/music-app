import { MainLayout } from "@/app/layouts/MainLayout/MainLayout";

export default function BasicLayout({ children }: LayoutProps<"/">) {
  return <MainLayout>{children}</MainLayout>;
}
