"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import FocusTimer from "@/components/FocusTimer";

export default function TimerPage() {
  return (
    <AuthGuard>
      <Navbar />
      <FocusTimer />
    </AuthGuard>
  );
}
