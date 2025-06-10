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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
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
        url: "https://serverless.roboflow.com/all-project-qtlcc/2",
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
    <div className="w-full h-screen p-4 md:p-10">
      <header className="w-full items-center justify-center mb-6">
        <div className="font-semibold text-2xl text-red-500 flex items-center space-x-2 text-center justify-center">
          <BsExclamationCircle />
          <p>AI Skin Lesion Detector</p>
        </div>
      </header>
      <div className="w-full lg:w-[80%] xl:w-[60%] mx-auto space-y-8 h-full flex flex-col text-center justify-center">
        <div>
          {file ? (
            <div className="w-full h-[70vh] rounded-2xl flex items-center justify-center bg-gray-100 p-4">
              <div className="relative max-w-full max-h-full">
                <img
                  src={`${imageUrl}`}
                  alt="Uploaded skin lesion"
                  className="w-full h-[65vh] object-contain"
                />
                {result?.predictions.map((prediction) => {
                  const {
                    x,
                    y,
                    width,
                    height,
                    class: className,
                    confidence
                  } = prediction;
                  const imgElement = document.querySelector("img");
                  if (!imgElement) return null;

                  const imgWidth = imgElement.clientWidth;
                  const imgHeight = imgElement.clientHeight;

                  const scaleX = imgWidth / result.image.width;
                  const scaleY = imgHeight / result.image.height;

                  const boxX = x * scaleX;
                  const boxY = y * scaleY;
                  const boxWidth = width * scaleX;
                  const boxHeight = height * scaleY;

                  return (
                    <div
                      key={prediction.detection_id}
                      style={{
                        position: "absolute",
                        top: `${boxY - boxHeight / 2}px`,
                        left: `${boxX - boxWidth / 2}px`,
                        width: `${boxWidth}px`,
                        height: `${boxHeight}px`,
                        border: "2px solid red",
                        backgroundColor: "rgba(255, 0, 0, 0.1)"
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-white px-2 py-1 rounded text-xs">
                        {className} ({(confidence * 100).toFixed(1)}%)
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
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
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
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
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

        <div className="w-full px-4 py-5 flex flex-col md:flex-row items-center divide-y-2 md:divide-y-0 md:divide-x-2 divide-gray-200 rounded-2xl shadow-xl">
          <div className="w-full md:w-[70%] pb-4 md:pb-0 pr-0 md:pr-4">
            {result != null ? (
              <div className="flex items-center justify-center space-x-5 overflow-x-auto">
                {result.predictions.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-2 text-lg font-semibold min-w-[80px]"
                    >
                      <div
                        className="radial-progress flex flex-col items-center justify-center bg-red-500 text-white border-red-400 border-4"
                        // @ts-ignore
                        style={{ "--value": Math.round(item.confidence * 100) }}
                        role="progressbar"
                      >
                        {Math.round(item.confidence * 100)}%
                      </div>
                      <p className="text-sm capitalize">{item.class}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-col items-center space-y-2 text-lg font-semibold">
                  <div
                    className="radial-progress bg-gray-200 text-gray-500 border-gray-300 border-4"
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
          <div className="w-full md:w-[30%] pt-4 md:pt-0 pl-0 md:pl-4 space-y-4">
            <label
              htmlFor="dropzone-files"
              className="w-full flex items-center justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-3 hover:bg-emerald-500 hover:shadow-lg hover:text-white cursor-pointer"
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
                <div className="px-5 w-full flex items-center text-white justify-center space-x-2 border-2 border-emerald-500 font-medium transition-all duration-150 ease-linear rounded-md py-3 bg-emerald-500 hover:shadow-inner hover:shadow-white disabled:opacity-50 disabled:cursor-not-allowed">
                  <Bot />
                  <p>Treatment Suggestion</p>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    These are some methods that can be helpful in treating the
                    lesion
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
