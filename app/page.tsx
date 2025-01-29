"use client";

import Image from "next/image";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className=" w-full min-h-screen relative ">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>

      <div className=" absolute left-[10%] top-[20%]">
        <div className=" relative">
          <div className=" w-40 h-40 p-6 text-center border-2 border-black absolute -left-10 -top-4 rounded-[50%] flex items-center flex-col justify-center space-y-1 text-white"></div>
          <div className=" w-40 h-40 p-6 text-center bg-black rounded-[50%] flex items-center flex-col justify-center space-y-1 text-white">
            <p>Ai Skin Scanner</p>
            <Image
              src={"/Arrow - Right 3.svg"}
              width={30}
              height={30}
              className=" rotate-90"
              alt=""
            />
          </div>
        </div>
      </div>

      <header className=" w-[80%] mx-auto py-10 flex items-center justify-between">
        <div className=" flex items-center space-x-2">
          <Bot />
          <h1 className=" font-semibold text-2xl">Skin-Scan</h1>
        </div>

        <button
          onClick={() => router.push("/detect")}
          className=" px-10 py-4 font-semibold z-50 text-base text-white shadow-xl bg-black"
        >
          Get Started
        </button>
      </header>

      <main className=" mt-5 w-[80%] mx-auto flex flex-col items-center ">
        <div className=" flex flex-col items-center  ">
          <h1
            className=" text-5xl font-bold max-w-[70%] text-center leading-normal mx-auto
          "
          >
            {" "}
            Skin Lession Project - Scan and detect threats in skin quickly &
            easily{" "}
          </h1>
          <br />
          <p className=" text-sm text-gray-500 text-center max-w-[60%] mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
            reiciendis minima fugit qui id porro obcaecati, veniam possimus
            neque vel voluptas cupiditate incidunt doloribus. Eum,
            exercitationem. Eaque dicta minima est.
          </p>
          <br />
          <div className=" w-[30rem]  z-50 h-[35rem] mt-10 border-2 border-black p-4 relative rounded-tl-full rounded-tr-full ">
            {/* <div className=" absolute -top-8 left-[50%] -translate-x-[50%]">
              <Image src={"/Scan.svg"} alt="" width={30} height={30} />
            </div> */}
            <div className=" w-full h-full rounded-tl-full rounded-tr-full overflow-hidden  relative">
              <Image
                src={
                  "/DALL·E 2025-01-10 19.13.11 - A high-tech AI object detection system analyzing a skin lesion on human skin. The scene includes a close-up of the skin area with an advanced digital .webp"
                }
                alt=""
                fill
                className=" object-center object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
