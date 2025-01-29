/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Bot, ImageIcon, Loader } from "lucide-react";
import { ReactTyped } from "react-typed";

import { useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";

interface InferenceResult {
  inference_id: string;
  time: number;
  image: {
    width: number;
    height: number;
  };
  predictions: Prediction[];
}

interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
  detection_id: string;
}

export default function Page() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // To store the generated image URL
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<InferenceResult | null>(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file); // Generate a temporary URL
      setImageUrl(url);

      const loadImageBase64 = (file: Blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const image = await loadImageBase64(file);

      axios({
        method: "POST",
        url: "https://detect.roboflow.com/skin-lesion-detection-dnuq9/2",
        params: {
          api_key: "VAlnq3JGLDoJAYHhL0vF"
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(function (response) {
          setResult(response.data);
          console.log(response.data);

          setLoading(false);
          console.log(result);
        })
        .catch(function (error) {
          console.log(error.message);
          setLoading(false);
        });
    }
  };

  const skinLesionSuggestions = [
    "Follow your dermatologist's instructions carefully.** This may include medication, procedures, or lifestyle changes. Topical medications:** Creams, ointments, or gels applied directly to the skin (e.g., corticosteroids, antibiotics, antifungals).",

    "**Oral medications:** Pills or liquids taken by mouth (e.g., antibiotics, antivirals, immunosuppressants).",
    "**Procedures:**",
    "**Cryotherapy:** Freezing the lesion with liquid nitrogen.",
    "**Laser therapy:** Using a laser to destroy the lesion.",
    "**Excision:** Surgically removing the lesion.",
    "**Curettage and electrodesiccation:** Scraping away the lesion and then cauterizing the area.",
    "**Photodynamic therapy:** Applying a medication to the lesion and then activating it with light.",
    "**Lifestyle changes:**",
    "**Sun protection:** Consistent use of sunscreen with an SPF of 30 or higher, wearing protective clothing, and seeking shade during peak sun hours.",
    "**Moisturizing:** Keeping the skin hydrated can help prevent dryness and irritation.",
    "**Avoiding irritants:** Identifying and avoiding substances that may irritate the skin (e.g., harsh soaps, chemicals).",
    "**Healthy diet:** Eating a balanced diet rich in fruits, vegetables, and antioxidants may support skin health.",
    "**Stress management:** Techniques like yoga, meditation, or deep breathing can help reduce stress, which may contribute to some skin conditions."
  ];

  const rand1 = Math.floor(Math.random() * 13);

  return (
    <div className=" w-full h-screen p-10">
      <header className=" w-full items-center justify-center">
        <div className=" font-semibold text-2xl text-red-500 flex items-center space-x-2 text-center justify-center">
          <BsExclamationCircle />
          <p>AI Skin Lession Detector</p>
        </div>
      </header>
      <div className=" w-[60%] mx-auto space-y-10 h-full flex flex-col text-center justify-center ">
        <div>
          {file ? (
            <div className=" w-full h-[60vh] rounded-2xl flex items-center justify-center">
              <div className=" relative ">
                <img src={`${imageUrl}`} alt="" className=" w-auto h-auto" />
                {result?.predictions.map((prediction) => {
                  const { x, y, width, height } = prediction;
                  const scaledWidth = (width / result.image.width) * 100; // Scale width to percentage
                  const scaledHeight = (height / result.image.height) * 100; // Scale height to percentage

                  return (
                    <div
                      key={prediction.detection_id}
                      style={{
                        position: "absolute",
                        top: `${(y / result.image.height - 0.3) * 100}% `,
                        left: `${(x / result.image.width - 0.1) * 100}% `,
                        width: `${scaledWidth}%`,
                        height: `${scaledHeight}%`
                      }}
                    >
                      <div
                        className=" bg-black/10"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          border: "2px solid red",
                          boxSizing: "border-box"
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: -25,
                            left: 0,
                            backgroundColor: "white",
                            padding: "2px 5px",
                            color: "black"
                          }}
                          className=" text-xs w-fit"
                        >
                          {prediction.class} ({prediction.confidence.toFixed(2)}
                          )
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className=" w-full px-10 py-5 flex items-center divide-x-2 divide-red-950 rounded-2xl shadow-xl">
          <div className=" w-[70%]">
            {result != null ? (
              <div className=" flex items-center space-x-5">
                {result.predictions.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className=" flex flex-col w-fit  space-y-4 text-lg font-semibold"
                    >
                      <div
                        className="radial-progress flex flex-col items-center justify-center bg-red-500 text-red-100 border-red-400 border-4"
                        // @ts-ignore
                        style={{ "--value": 70 }}
                        role="progressbar"
                      >
                        {Math.round(item.confidence * 100)}%
                      </div>
                      <p className=" text-sm capitalize">{item.class}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className=" flex flex-col w-fit  space-y-4 text-lg font-semibold">
                  <div
                    className="radial-progress bg-primary text-primary-content border-primary border-4"
                    // @ts-ignore
                    style={{ "--value": 0 }}
                    role="progressbar"
                  >
                    0%
                  </div>
                  <p>No Detection</p>
                </div>
              </div>
            )}
          </div>
          <div className=" w-[30%] pl-10 space-y-4 ">
            <label
              htmlFor="dropzone-files"
              className=" w-full flex items-center justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-4 hover:bg-emerald-500 hover:shadow-xl hover:text-white"
            >
              {loading ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Loader size={24} className="animate-spin" />
                </div>
              ) : (
                <ImageIcon size={24} />
              )}
              <p>Detect Lesion</p>
              <input
                id="dropzone-files"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <AlertDialog>
              <AlertDialogTrigger disabled={result == null}>
                <div className=" px-5 w-full flex items-center text-white justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-4 bg-emerald-500 hover:shadow-inner hover:shadow-white  ">
                  <Bot />
                  <p>Treatment Suggestion</p>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    These are some methods that can be helpful in treatment the
                    lession
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <ReactTyped
                      strings={[skinLesionSuggestions[rand1]]}
                      typeSpeed={20}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
