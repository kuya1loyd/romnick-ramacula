"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Smartphone,
  Loader2,
} from "lucide-react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const fileUrl =
    searchParams.get("file") || "/tasks/TTL_Post_Presentation_Activity_Sheet.pdf";
  const title =
    searchParams.get("title") ||
    "Technology for Teaching and Learning – Post-Presentation Learning Activity Sheet";

  const [viewMode, setViewMode] = useState<"google" | "native">("google");
  const [isLoading, setIsLoading] = useState(true);
  const [fullPdfUrl, setFullPdfUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
        setFullPdfUrl(fileUrl);
      } else {
        const origin = window.location.origin;
        const path = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;
        setFullPdfUrl(`${origin}${path}`);
      }
    }
  }, [fileUrl]);

  const googleDocsViewerUrl = useMemo(() => {
    if (!fullPdfUrl) return "";
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;
  }, [fullPdfUrl]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 bg-white px-3 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <Link
            href="/#my-tasks"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>
          <div className="w-[1px] h-6 bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-[200px] sm:max-w-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setViewMode("google");
                setIsLoading(true);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "google"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile Cloud</span>
            </button>
            <button
              onClick={() => setViewMode("native")}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "native"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Native</span>
            </button>
          </div>

          <a
            href={fileUrl}
            download
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </header>

      {/* PDF Viewer Container */}
      <main className="flex-1 w-full bg-slate-900 relative flex flex-col">
        {viewMode === "google" ? (
          <div className="relative w-full h-full flex-1 bg-slate-100 flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs text-white z-10">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
                <span className="text-xs font-medium">Loading document pages...</span>
              </div>
            )}
            {googleDocsViewerUrl ? (
              <iframe
                key={googleDocsViewerUrl}
                src={googleDocsViewerUrl}
                title={title}
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-0 bg-white"
              />
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                Generating preview link...
              </div>
            )}
          </div>
        ) : (
          <object
            data={`${fileUrl}#toolbar=1&navpanes=0&view=FitH`}
            type="application/pdf"
            className="w-full flex-1 border-0"
          >
            <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-slate-900 text-white">
              <FileText className="w-16 h-16 text-indigo-400 mb-4" />
              <p className="text-sm text-slate-300 mb-4">
                Your mobile browser does not embed inline raw PDFs.
              </p>
              <button
                type="button"
                onClick={() => setViewMode("google")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm mb-3"
              >
                Switch to Mobile Cloud Viewer
              </button>
            </div>
          </object>
        )}

        {/* Mobile helper notice */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">
              Romnick P. Ramacula • BEEd-2C • Instructor Kerstan Isaac Requiza
            </span>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4 flex items-center gap-1 shrink-0 ml-3"
          >
            <span>Open raw PDF</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </main>
    </div>
  );
}

export default function TaskPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 text-sm">
          Loading document preview...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
