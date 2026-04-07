import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, Film, Music, Sparkles, Download, Loader2, Wand2 } from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";
import { cn } from "../lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import { useTranslation } from "react-i18next";

export const CreativeLab = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'music'>('image');
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ type: string, url: string } | null>(null);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: imageSize
          }
        }
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setResult({ type: 'image', url: `data:image/png;base64,${part.inlineData.data}` });
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY! }
        });
        const blob = await response.blob();
        setResult({ type: 'video', url: URL.createObjectURL(blob) });
      }
    } catch (error) {
      console.error("Video generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMusic = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContentStream({
        model: "lyria-3-clip-preview",
        contents: prompt,
      });

      let audioBase64 = "";
      let mimeType = "audio/wav";

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
            audioBase64 += part.inlineData.data;
          }
        }
      }

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mimeType });
      setResult({ type: 'music', url: URL.createObjectURL(blob) });
    } catch (error) {
      console.error("Music generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (activeTab === 'image') handleGenerateImage();
    if (activeTab === 'video') handleGenerateVideo();
    if (activeTab === 'music') handleGenerateMusic();
  };

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black bg-gradient-to-r from-brand-blue via-brand-purple to-brand-yellow bg-clip-text text-transparent">
          {t('creative_lab.title')}
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">{t('creative_lab.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Controls */}
        <Card className="p-8 space-y-8 bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors">
          <div className="flex gap-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-3xl">
            {(['image', 'video', 'music'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setResult(null); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all",
                  activeTab === tab ? "bg-white dark:bg-slate-700 shadow-md text-brand-blue" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                {tab === 'image' && <ImageIcon className="w-5 h-5" />}
                {tab === 'video' && <Film className="w-5 h-5" />}
                {tab === 'music' && <Music className="w-5 h-5" />}
                <span className="capitalize">{t(`creative_lab.tab_${tab}`)}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-bold text-slate-700 dark:text-slate-300">{t('creative_lab.prompt_label')}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t(`creative_lab.prompt_placeholder_${activeTab}`)}
              className="w-full h-32 bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 text-lg focus:outline-none focus:ring-4 focus:ring-brand-blue/10 border-2 border-slate-100 dark:border-slate-700 dark:text-white"
            />
          </div>

          {activeTab === 'image' && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('creative_lab.quality')}</label>
              <div className="flex gap-4">
                {(['1K', '2K', '4K'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={cn(
                      "flex-1 py-2 rounded-xl font-bold border-2 transition-all",
                      imageSize === size ? "border-brand-blue bg-blue-50 dark:bg-blue-900/20 text-brand-blue" : "border-slate-100 dark:border-slate-700 text-slate-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button 
            size="lg" 
            className="w-full py-6 text-xl" 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {t('creative_lab.generating')}
              </>
            ) : (
              <>
                <Wand2 className="w-6 h-6" />
                {t('creative_lab.generate_btn')}
              </>
            )}
          </Button>
        </Card>

        {/* Preview */}
        <Card className="p-8 flex items-center justify-center min-h-[400px] border-dashed border-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full space-y-6"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-2xl bg-black aspect-square flex items-center justify-center">
                  {result.type === 'image' && <img src={result.url} alt="Generated" className="w-full h-full object-cover" />}
                  {result.type === 'video' && <video src={result.url} controls autoPlay loop className="w-full h-full" />}
                  {result.type === 'music' && (
                    <div className="flex flex-col items-center gap-6 p-12">
                      <div className="bg-brand-purple p-8 rounded-full animate-pulse">
                        <Music className="w-16 h-16 text-white" />
                      </div>
                      <audio src={result.url} controls className="w-full" />
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full dark:border-slate-700 dark:text-white" onClick={() => {
                  const link = document.createElement('a');
                  link.href = result.url;
                  link.download = `brainykids-${activeTab}-${Date.now()}`;
                  link.click();
                }}>
                  <Download className="w-5 h-5" />
                  {t('creative_lab.download')}
                </Button>
              </motion.div>
            ) : (
              <div className="text-center space-y-4 text-slate-400">
                <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10" />
                </div>
                <p className="text-lg font-medium">{t('creative_lab.preview_placeholder')}</p>
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};
