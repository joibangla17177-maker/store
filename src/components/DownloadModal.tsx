import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  ShieldCheck,
  HardDrive,
  Copy,
  Check,
  FileCode,
  Loader2,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AppItem, DownloadResponse, PlatformType } from '../types';
import { AppIcon } from './AppIcon';

interface DownloadModalProps {
  app: AppItem | null;
  platform?: PlatformType;
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  app,
  platform = 'Windows',
  isOpen,
  onClose,
}) => {
  const [stage, setStage] = useState<'initiating' | 'resolving' | 'ready'>('initiating');
  const [downloadData, setDownloadData] = useState<DownloadResponse | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !app) {
      setStage('initiating');
      setDownloadData(null);
      setErrorMsg(null);
      return;
    }

    let isMounted = true;
    setStage('initiating');
    setErrorMsg(null);

    const timer1 = setTimeout(() => {
      if (isMounted) setStage('resolving');
    }, 600);

    const triggerDownload = async () => {
      try {
        const res = await fetch(`/api/download/${app.slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform }),
        });

        // Parse response
        let data: any;
        try {
          data = await res.json();
        } catch {
          // If JSON parse fails
          throw new Error('Failed to get download information');
        }

        if (!res.ok || !data.success) {
          throw new Error(data?.message || 'Failed to resolve installer');
        }

        if (isMounted) {
          setDownloadData(data);
          setStage('ready');

          // Immediately redirect to Google Drive - no download system
          if (data?.app?.downloadUrl) {
            setTimeout(() => {
              // Open Google Drive in new tab
              window.open(data.app.downloadUrl, '_blank', 'noopener,noreferrer');
              // Close modal after redirect
              setTimeout(() => {
                if (isMounted) {
                  onClose();
                }
              }, 500);
            }, 600);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || 'Error preparing download package.');
          setStage('ready');
        }
      }
    };

    const timer2 = setTimeout(() => {
      triggerDownload();
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, app, platform, onClose]);

  if (!isOpen || !app) return null;

  const copyChecksum = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Check if download is available
  const isDownloadAvailable = downloadData?.app?.downloadUrl && !errorMsg;

  return (
    <div
      id="download-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="download-modal-content"
        className="relative w-full max-w-lg rounded-2xl border border-purple-500/20 bg-[#0E101B] shadow-2xl shadow-purple-950/60 p-6 sm:p-8 overflow-hidden text-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header with App Info */}
        <div className="flex items-center gap-4 mb-6">
          <AppIcon type={app.iconType} size="md" />
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{app.name}</h3>
            <p className="text-xs text-purple-300">
              Version {app.currentVersion} • {platform} (64-bit)
            </p>
          </div>
        </div>

        {/* Progress or Ready State */}
        {stage !== 'ready' ? (
          <div className="py-8 text-center space-y-4">
            <div className="relative flex items-center justify-center mx-auto w-16 h-16 rounded-full bg-purple-950/60 border border-purple-500/30">
              <Loader2 size={32} className="text-purple-400 animate-spin" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-semibold text-white">
                {stage === 'initiating'
                  ? 'Preparing redirect to Google Drive...'
                  : 'Opening your Google Drive file...'}
              </h4>
              <p className="text-xs text-slate-400">
                Connecting to your secure cloud storage.
              </p>
            </div>

            {/* Simulated mini progress meter */}
            <div className="w-full bg-[#17192b] rounded-full h-1.5 overflow-hidden">
              <div
                className={`bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-700 ${
                  stage === 'initiating' ? 'w-1/3' : 'w-4/5'
                }`}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Error Banner if no download available */}
            {errorMsg && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200">
                <AlertCircle size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-100">Link Unavailable</p>
                  <p className="text-xs text-red-300/90 mt-0.5">
                    {errorMsg}
                  </p>
                </div>
              </div>
            )}

            {/* Ready / Redirected banner */}
            {!errorMsg && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
              <CheckCircle2 size={22} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Redirecting to Google Drive</p>
                <p className="text-xs text-purple-300/90 mt-0.5">
                  Opening <span className="font-mono font-medium text-white">{downloadData?.app?.fileName || app.downloadFileName}</span> in Google Drive.
                </p>
              </div>
            </div>
            )}

            {/* File Info Card */}
            {!errorMsg && (
            <div className="rounded-xl bg-[#141627] border border-purple-900/30 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-purple-950/40">
                <span className="text-slate-400">File Name:</span>
                <span className="font-mono text-white">{downloadData?.app?.fileName || app.downloadFileName}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-purple-950/40">
                <span className="text-slate-400">File Size:</span>
                <span className="text-white font-medium">{downloadData?.app?.fileSize || app.downloadFileSize}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Source:</span>
                <span className="text-purple-300 font-medium inline-flex items-center gap-1.5">
                  <HardDrive size={12} />
                  Google Drive
                </span>
              </div>
            </div>
            )}

            {/* Info notice */}
            {!errorMsg && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-[#090A10] p-3 rounded-lg border border-purple-950/30">
              <ExternalLink size={14} className="text-purple-400 flex-shrink-0" />
              <span>
                You will be taken to Google Drive in a new tab. Download directly from there.
              </span>
            </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {!errorMsg ? (
                <>
                  <button
                    onClick={() => {
                      if (downloadData?.app?.downloadUrl) {
                        window.open(downloadData.app.downloadUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/40 text-sm transition-all"
                  >
                    <ExternalLink size={16} />
                    <span>Open Google Drive</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-[#1a1d2e] hover:bg-[#22263d] transition-all"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full px-5 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/40 transition-all"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
