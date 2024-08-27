import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({ type }: { type?: "full" | "normal" }) => {
  return (
    <Link href={"/"} className="">
      {type === "full" ? (
        <Image
          width={130}
          height={130}
          quality={100}
          src="/wood-decor-logo-full.png"
          alt=""
        />
      ) : (
        <Image
          width={30}
          height={30}
          quality={100}
          src="/wood-decor-logo.jpg"
          alt=""
        />
      )}
    </Link>
  );
};

export default Logo;
