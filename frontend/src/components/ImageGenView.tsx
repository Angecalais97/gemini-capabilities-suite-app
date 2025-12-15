import { useState } from "react";
import { SparklesIcon, LoaderIcon } from "./Icons";
import { imageGen } from "../services/geminiService";
import type { GeneratedImage } from "../types";

export const ImageGenView = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const { image } = await imageGen(prompt);

      if (image) {
        setGeneratedImages((prev) => [
          {
            url: image,
            prompt,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
        setPrompt("");
      } else {
        alert("Failed to generate image. Please try again.");
      }
    } catch (err) {
      console.error("Image generation error", err);
      alert("An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <SparklesIcon className="w-6 h-6 text-purple-400" />
            Image Generation
          </h2>
          <p className="text-slate-400">
            Powered by the Gemini image generation model.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city with flying cars, cyberpunk style..."
            className="flex-1 bg-slate-800 border-slate-700 text-slate-100 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-4 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <LoaderIcon className="w-5 h-5" />
            ) : (
              <SparklesIcon className="w-5 h-5" />
            )}
            Generate
          </button>
        </form>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="aspect-square bg-slate-800 rounded-2xl animate-pulse flex items-center justify-center border border-slate-700">
              <div className="text-purple-400 font-medium flex flex-col items-center gap-2">
                <LoaderIcon className="w-8 h-8" />
                <span>Creating masterpiece...</span>
              </div>
            </div>
          )}

          {generatedImages.map((img) => (
            <div
              key={img.timestamp}
              className="group relative aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-slate-700"
            >
              <img
                src={img.url}
                alt={img.prompt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-white text-sm line-clamp-2 font-medium">
                  {img.prompt}
                </p>
                <div className="mt-2 flex gap-2">
                  <a
                    href={img.url}
                    download={`gemini-gen-${img.timestamp}.png`}
                    className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur px-2 py-1 rounded text-white"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {generatedImages.length === 0 && !loading && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
            <SparklesIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">
              Your imagination is the limit. Try a prompt above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
