"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { identifyPlant } from "../utils/geminiApi";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Loader2, Camera } from "lucide-react";

export default function PlantIdentifier() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleIdentify = async () => {
    if (file) {
      setLoading(true);
      setError(null);
      try {
        const identification = await identifyPlant(file);
        setResult(identification);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocurrió un error desconocido";
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <h1 className="mb-8 text-4xl font-semibold text-center text-white">
        PLANT <span className="text-4xl font-extrabold text-600">LENTS</span>
      </h1>
      <Card className="w-full border-green-200 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <h1 className="mb-6 text-3xl font-bold text-center text-green-800">
            Identificador de Plantas
          </h1>
          <div className="mb-6">
            <label
              htmlFor="image-upload"
              className="block mb-2 text-sm font-medium text-green-700"
            >
              Sube una imagen de planta o toma una foto
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="image-upload"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <Button
                onClick={handleCameraCapture}
                className="flex-1 text-white bg-green-600 hover:bg-green-700"
              >
                <Camera className="w-4 h-4 mr-2" />
                Tomar Foto
              </Button>
              <label
                htmlFor="image-upload"
                className="inline-flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md cursor-pointer hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Subir Imagen
              </label>
            </div>
          </div>
          {image && (
            <div className="flex justify-center mt-6">
              <Image
                src={image}
                alt="Planta subida"
                width={300}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
          )}
          <Button
            onClick={handleIdentify}
            disabled={!file || loading}
            className="w-full mt-6 text-white bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Identificando...
              </>
            ) : (
              "Identificar Planta"
            )}
          </Button>
          {result && (
            <div className="p-4 mt-6 bg-white rounded-lg shadow">
              <h2 className="mb-2 text-xl font-semibold text-green-800">
                Resultado de la Identificación:
              </h2>
              <p className="text-sm text-green-700 whitespace-pre-wrap">
                {result}
              </p>
            </div>
          )}
          {error && (
            <div className="p-4 mt-6 rounded-lg shadow bg-red-50">
              <h2 className="mb-2 text-xl font-semibold text-red-800">Error</h2>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
