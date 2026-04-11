"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const GlobeIntro = dynamic(() => import("@/components/GlobeIntro"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-[9999]" />,
});

export default function IntroPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // If already seen, redirect immediately
    if (document.cookie.includes("globe_seen=1")) {
      router.replace("/");
    }
  }, [router]);

  const handleComplete = () => {
    setShow(false);
    router.replace("/");
  };

  if (!show) return null;

  return <GlobeIntro onComplete={handleComplete} />;
}
