import Head from "next/head";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu } from "react-icons/hi";

export default function Layout({ children }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Shariar Chat Application</title>
        <meta name="description" content="Chat Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" h-20 px-8 sm:px-20 py-5 bg-purple-200 flex justify-between items-center">
        <div className="text-xl">
          <Link href={"/"}>
            <a>
              <Image src={"/logo.png"} width={63} height={58} alt={"logo"} />
            </a>
          </Link>
        </div>
        {/* desing for mobile device */}
        <div className="block md:hidden relative">
          <button onClick={() => setShowMenu(!showMenu)}>
            <HiMenu className="h-6 w-6" />
          </button>
          <ul
            className={`absolute flex-col z-50 -left-16 rounded top-6 bg-white ${
              showMenu ? "flex" : "hidden"
            }`}
          >
            <li className="p-3 bg-white hover:bg-gray-200">
              <Link href={"/login"}>
                <a className="w-full h-full">Login</a>
              </Link>
            </li>
            <li className="p-3 bg-white hover:bg-gray-200">
              <Link href={"/register"}>
                <a className="w-full h-full">Register</a>
              </Link>
            </li>
          </ul>
        </div>
        {/* design for defult */}
        <div className="hidden md:block">
          <ul className="flex gap-3 items-center justify-center">
            <li>
              <Link href={"/login"}>
                <a>Login</a>
              </Link>
            </li>
            <li>
              <Link href={"/register"}>
                <a>Register</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-full">{children}</div>
    </div>
  );
}
