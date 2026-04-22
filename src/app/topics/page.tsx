"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import TopicTree from "@/components/TopicTree";

export default function TopicsPage() {
  return (
    <AuthGuard>
      <Navbar />
      <TopicTree />
    </AuthGuard>
  );
}
