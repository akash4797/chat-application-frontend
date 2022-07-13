import Head from "next/head";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Shariar Chat Application</title>
        <meta name="description" content="Chat Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" h-20 px-20 py-5 bg-purple-200 flex justify-between items-center">
        <div className="text-xl">
          <Link href={"/"}>
            <a>
              <Image src={"/logo.svg"} width={84} height={50} alt={"logo"} />
            </a>
          </Link>
        </div>
        <div>
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
