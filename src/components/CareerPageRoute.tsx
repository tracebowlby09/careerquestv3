"use client";

import { Career } from "@/types/game";
import CareerInfoPage from "./CareerInfoPage";
import { useRouter } from "next/navigation";

export default function CareerPageRoute({ career }: { career: Career }) {
  const router = useRouter();

  return (
    <CareerInfoPage
      career={career}
      onBack={() => router.push("/")}
      onStartCareer={() => router.push("/")}
    />
  );
}
