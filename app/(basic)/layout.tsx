import { MainLayout } from "@/app/layouts/MainLayout";

export default function BasicLayout({ children }: LayoutProps<"/">) {
  return <MainLayout>{children}</MainLayout>;
}
