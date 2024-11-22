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

  const formatResult = (text: string) => {
    const lines = text.split("\n");
    let inList = false;

    return lines.map((line, index) => {
      line = line.replace(/\*/g, "");

      if (line.trim().startsWith("- ")) {
        if (!inList) {
          inList = true;
          return (
            <ul key={`list-${index}`} className="list-disc pl-5 mb-4">
              <li className="text-green-700">{line.trim().slice(2)}</li>
            </ul>
          );
        } else {
          return (
            <li key={index} className="text-green-700">
              {line.trim().slice(2)}
            </li>
          );
        }
      } else {
        if (inList) {
          inList = false;
        }

        if (line.trim() === "") {
          return <br key={index} />;
        }

        if (index === 0 || line.length <= 50) {
          return (
            <h3
              key={index}
              className="text-xl font-bold text-green-800 mt-4 mb-2"
            >
              {line.trim()}
            </h3>
          );
        } else if (line.length <= 100) {
          return (
            <h4
              key={index}
              className="text-lg font-bold text-green-700 mt-3 mb-2"
            >
              {line.trim()}
            </h4>
          );
        }

        return (
          <p key={index} className="mb-2 text-green-700">
            {line.trim()}
          </p>
        );
      }
    });
  };

  return (
    <Card className="w-full bg-white/90 border-green-200 shadow-lg backdrop-blur-sm">
      <CardContent className="p-6">
        <h1 className="text-4xl font-semibold text-green-800 mb-6 text-center">
          Plant <span className="font-extrabold">Lens</span>
        </h1>
        <div className="mb-6">
          <label
            htmlFor="image-upload"
            className="block text-sm font-medium text-green-700 mb-2"
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Camera className="mr-2 h-4 w-4" />
              Tomar Foto
            </Button>
            <label
              htmlFor="image-upload"
              className="flex-1 inline-flex items-center justify-center rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 cursor-pointer"
            >
              Subir Imagen
            </label>
          </div>
        </div>
        {image && (
          <div className="mt-6 flex justify-center">
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
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Identificando...
            </>
          ) : (
            "Identificar Planta"
          )}
        </Button>
        {result && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Resultado de la Identificación:
            </h2>
            <div className="space-y-2">{formatResult(result)}</div>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
