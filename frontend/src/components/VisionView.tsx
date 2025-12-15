import { useState, useRef } from "react";
import { UploadIcon, LoaderIcon, SendIcon } from "./Icons";
import { vision } from "../services/geminiService";

export const VisionView = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;

      // Preview keeps full data URL
      setPreviewUrl(dataUrl);

      // Backend expects pure base64 (no prefix)
      const base64 = dataUrl.split(",")[1];
      setSelectedImage(base64);
      setResult("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || loading) return;

    setLoading(true);
    setResult("");

    try {
      const { text } = await vision(
        selectedImage,
        prompt || "Describe this image in detail."
      );
      setResult(text);
    } catch (error) {
      console.error(error);
      setResult("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Vision Analysis</h2>
          <p className="text-slate-400">
            Upload an image and ask Gemini to describe it, extract text, or answer
            questions about it.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            previewUrl
              ? "border-blue-500 bg-slate-800/50"
              : "border-slate-700 hover:border-slate-600 hover:bg-slate-800"
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 rounded-lg object-contain"
            />
          ) : (
            <>
              <UploadIcon className="w-12 h-12 text-slate-500 mb-4" />
              <p className="text-slate-300 font-medium">
                Click to upload an image
              </p>
              <p className="text-slate-500 text-sm mt-1">
                JPG, PNG supported
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Prompt & Action */}
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to know about this image?"
            className="w-full bg-slate-800 border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          />
          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl p-4 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <LoaderIcon className="w-5 h-5" />
            ) : (
              <SendIcon className="w-5 h-5" />
            )}
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Analysis Result
            </h3>
            <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
