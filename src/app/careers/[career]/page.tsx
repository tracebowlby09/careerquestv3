import { notFound } from "next/navigation";
import { Career, careerInfoByCareer } from "@/lib/careerInfo";
import CareerPageRoute from "@/components/CareerPageRoute";

type CareerPageParams = Promise<{ career: string }> | { career: string };

export function generateStaticParams() {
  return Object.keys(careerInfoByCareer).map((career) => ({ career }));
}

export async function generateMetadata({ params }: { params: CareerPageParams }) {
  const resolvedParams = await params;
  const info = careerInfoByCareer[resolvedParams.career as Career];

  if (!info) {
    return {
      title: "Career Not Found - Career Quest",
    };
  }

  return {
    title: `${info.title} - Career Quest`,
    description: `Learn about ${info.title}, including salary, skills, day-in-life details, training, and tools.`,
  };
}

export default async function CareerPage({ params }: { params: CareerPageParams }) {
  const resolvedParams = await params;
  const info = careerInfoByCareer[resolvedParams.career as Career];

  if (!info) {
    notFound();
  }

  return <CareerPageRoute career={info.id} />;
}
