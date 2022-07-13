import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <div className="bg-purple-700 h-full relative text-white flex justify-center items-center flex-col p-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-center">
            Free Message Application
          </h1>
          <h5 className="text-gray-300 text-center">
            This application is built with multiple technologies and
            dependancies. try this application and get the features.
          </h5>
        </div>
        <div className="mt-5 flex gap-5">
          <Link href={"/register"}>
            <a className="px-3 py-2 bg-purple-300 text-black rounded font-semibold">
              Get Started
            </a>
          </Link>
          <Link href={"/login"}>
            <a className="px-3 py-2 border-2 border-purple-300 text-white rounded font-semibold">
              Login
            </a>
          </Link>
        </div>
        <div className="absolute bottom-0 py-5 bg-black/40 w-full flex justify-center items-center">
          <h1 className="text-xs">Developed by Shariar Akash</h1>
        </div>
      </div>
    </Layout>
  );
}
