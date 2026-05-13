// app/page.tsx
// Next.js의 메인 페이지입니다.
// 사용자가 루트 주소(/)로 접속했을 때 Dashboard 컴포넌트를 보여줍니다.

import Dashboard from "@/components/Dashboard";

export default function Home() {
  return <Dashboard />;
}
