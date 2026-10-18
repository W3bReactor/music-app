import { MainLayout } from "@/app/layouts/MainLayout/MainLayout";

export default function IntroLayout({ children }: LayoutProps<"/">) {
  return <MainLayout isIntro={true}>{children}</MainLayout>;
}
