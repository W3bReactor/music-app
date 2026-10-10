import { MainLayout } from "@/app/layouts/MainLayout";

export default function IntroLayout({ children }: LayoutProps<"/">) {
  return <MainLayout isIntro={true}>{children}</MainLayout>;
}
