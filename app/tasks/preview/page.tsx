"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, ExternalLink, GraduationCap } from "lucide-react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const fileUrl =
    searchParams.get("file") || "/tasks/TTL_Post_Presentation_Activity_Sheet.pdf";
  const title =
    searchParams.get("title") ||
    "Technology for Teaching and Learning – Post-Presentation Learning Activity Sheet";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3 overflow-hidden">
          <Link
            href="/#my-tasks"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Portfolio</span>
          </Link>
          <div className="w-[1px] h-6 bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-md sm:max-w-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>New Tab</span>
          </a>
          <a
            href={fileUrl}
            download
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </header>

      {/* PDF Viewer Container */}
      <main className="flex-1 w-full bg-slate-900 relative flex flex-col">
        <object
          data={`${fileUrl}#toolbar=1&navpanes=0&view=FitH`}
          type="application/pdf"
          className="w-full flex-1 border-0"
        >
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=0&view=FitH`}
            title={title}
            className="w-full flex-1 border-0"
          >
            <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-slate-900 text-white">
              <FileText className="w-16 h-16 text-indigo-400 mb-4" />
              <p className="text-sm text-slate-300 mb-4">
                Your browser does not support inline PDF viewing.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
              >
                Open PDF Document
              </a>
            </div>
          </iframe>
        </object>

        {/* Mobile helper notice */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>
              Romnick P. Ramacula • BEEd-2C • Instructor Kerstan Isaac Requiza
            </span>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4"
          >
            Direct File Link
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
