"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  router.push("/admin/products");
  return <div></div>;
};

export default Page;
