import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Check,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  FileImage,
  Loader2,
  ExternalLink,
  Link2,
  Info
} from 'lucide-react';
import { AdminAppItem } from './AdminApps';

interface AdminAddAppProps {
  initialApp?: AdminAppItem | null;
  onBack: () => void;
  onSave: (appData: Partial<AdminAppItem>) => void;
}

export const AdminAddApp: React.FC<AdminAddAppProps> = ({
  initialApp,
  onBack,
  onSave,
}) => {
  // Basic Form fields
  const [name, setName] = useState(initialApp?.name || '');
  const [category, setCategory] = useState(initialApp?.category || '');
  const [shortDescription, setShortDescription] = useState(
    initialApp?.shortDescription || ''
  );
  const [fullDescription, setFullDescription] = useState(
    initialApp?.fullDescription || ''
  );
  const [platforms, setPlatforms] = useState<string[]>(
    initialApp?.platforms || ['Windows']
  );
  const [price, setPrice] = useState<string>(
    initialApp ? initialApp.price.toString() : '29.99'
  );
  const [currency, setCurrency] = useState('USD - US Dollar');
  const [version, setVersion] = useState(initialApp?.version || '1.0.0');
  const [googleDriveFile, setGoogleDriveFile] = useState(
    initialApp?.googleDriveFile || ''
  );
  const [googleDriveFolder, setGoogleDriveFolder] = useState(
    initialApp?.googleDriveFolder || ''
  );
  const [status, setStatus] = useState<'Draft' | 'Published'>(
    initialApp?.status || 'Draft'
  );
  const [showOnStore, setShowOnStore] = useState(
    initialApp?.showOnStore !== undefined ? initialApp.showOnStore : false
  );

  // App Icon Source and State Management
  const initialSourceType: 'upload' | 'google_drive' =
    initialApp?.iconSourceType ||
    (initialApp?.iconFileId
      ? 'google_drive'
      : initialApp?.iconUrl
      ? 'upload'
      : 'upload');

  const [iconSourceType, setIconSourceType] = useState<'upload' | 'google_drive'>(
    initialSourceType
  );
  const [iconUrl, setIconUrl] = useState<string>(initialApp?.iconUrl || '');
  const [iconFileName, setIconFileName] = useState<string>(
    initialApp?.iconFileName || (initialApp?.iconUrl ? `${initialApp.slug || 'app'}-icon.png` : '')
  );
  const [iconFileSize, setIconFileSize] = useState<string>(
    initialApp?.iconSize || (initialApp?.iconUrl ? '256 KB' : '')
  );
  const [iconMimeType, setIconMimeType] = useState<string>(
    initialApp?.iconMimeType || (initialApp?.iconUrl ? 'image/png' : '')
  );
  const [iconFileId, setIconFileId] = useState<string>(
    initialApp?.iconFileId || ''
  );

  // Google Drive mode states
  const [driveLinkInput, setDriveLinkInput] = useState<string>(
    initialApp?.iconFileId
      ? `https://drive.google.com/file/d/${initialApp.iconFileId}/view`
      : ''
  );
  const [isDriveLoading, setIsDriveLoading] = useState<boolean>(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  // Upload mode states
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Screenshots state
  const [screenshots, setScreenshots] = useState<Array<{id: string; url: string; name: string; size: string}>>([]);
  const [screenshotDragging, setScreenshotDragging] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // ZIP File upload state
  const [uploadedZipFile, setUploadedZipFile] = useState<{fileName: string; fileSize: string; fileData: string} | null>(
    initialApp?.uploadedFileData ? {
      fileName: initialApp.uploadedFileName || 'app.zip',
      fileSize: initialApp.uploadedFileSize || '0 KB',
      fileData: initialApp.uploadedFileData
    } : null
  );
  const [zipDragging, setZipDragging] = useState(false);
  const zipFileInputRef = useRef<HTMLInputElement>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  // Google Drive Link handlers for APP FILE (not icon)
  const handleGoogleDriveFileLink = (link: string) => {
    try {
      // Extract file ID from various Google Drive link formats
      let fileId = '';
      
      if (link.includes('/d/')) {
        // Format: https://drive.google.com/file/d/{fileId}/view
        fileId = link.split('/d/')[1].split('/')[0];
      } else if (link.includes('?id=')) {
        // Format: https://drive.google.com/file?id={fileId}
        fileId = link.split('?id=')[1].split('&')[0];
      } else if (link.match(/^[a-zA-Z0-9_-]{20,}$/)) {
        // Direct file ID
        fileId = link;
      }
      
      if (!fileId) {
        return null;
      }
      
      return {
        fileId,
        link: `https://drive.google.com/file/d/${fileId}/view`,
        shareName: `Google Drive File (${fileId.substring(0, 8)}...)`,
      };
    } catch (err) {
      return null;
    }
  };

  const handleSetGoogleDriveFile = (link: string) => {
    const result = handleGoogleDriveFileLink(link);
    if (result) {
      setGoogleDriveFile(result.link);
    }
  };

  // Google Drive Modal Selector mock state for Installer file
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveModalType, setDriveModalType] = useState<'file' | 'folder'>('file');

  const handlePlatformToggle = (platform: string) => {
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((p) => p !== platform));
      }
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const handleOpenDrivePicker = (type: 'file' | 'folder') => {
    setDriveModalType(type);
    setShowDriveModal(true);
  };

  // Upload File handler
  const processUploadedFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (
      !validExtensions.includes(file.type.toLowerCase()) &&
      !['png', 'jpg', 'jpeg', 'webp'].includes(fileExt || '')
    ) {
      setUploadError('Unsupported image format. Please select a PNG, JPG, or WEBP file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Excessive file size. App icon must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setIconUrl(dataUrl);
      setIconFileName(file.name);
      setIconFileSize(
        file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`
      );
      setIconMimeType(file.type || 'image/png');
      setIconFileId('');
      setIconSourceType('upload');
      setUploadError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Google Drive Link Loader
  const handleLoadDriveIcon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!driveLinkInput || !driveLinkInput.trim()) {
      setDriveError('Invalid Google Drive link.');
      return;
    }

    setIsDriveLoading(true);
    setDriveError(null);

    try {
      const res = await fetch('/api/admin/validate-drive-icon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: driveLinkInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setDriveError(data.message || 'Invalid Google Drive link.');
        setIsDriveLoading(false);
        return;
      }

      const iconData = data.iconData;
      setIconUrl(iconData.previewUrl);
      setIconFileName(iconData.fileName);
      setIconFileSize(iconData.fileSize);
      setIconMimeType(iconData.mimeType);
      setIconFileId(iconData.fileId);
      setIconSourceType('google_drive');
      setDriveError(null);
    } catch (err) {
      setDriveError('Unable to access the selected file.');
    } finally {
      setIsDriveLoading(false);
    }
  };

  // Remove icon
  const handleRemoveIcon = () => {
    setIconUrl('');
    setIconFileName('');
    setIconFileSize('');
    setIconMimeType('');
    setIconFileId('');
    setDriveError(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Replace / Change icon
  const handleReplaceIcon = () => {
    if (iconSourceType === 'upload') {
      fileInputRef.current?.click();
    } else {
      // In drive mode, clear current url so the user can enter another link
      setIconUrl('');
      setDriveError(null);
    }
  };

  // Screenshot upload handler
  const handleScreenshotUpload = (file: File) => {
    const validExtensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (
      !validExtensions.includes(file.type.toLowerCase()) &&
      !['png', 'jpg', 'jpeg', 'webp'].includes(fileExt || '')
    ) {
      alert('Unsupported image format. Please select a PNG, JPG, or WEBP file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Screenshot must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newScreenshot = {
        id: 'ss-' + Math.random().toString(36).substring(2, 9),
        url: dataUrl,
        name: file.name,
        size: file.size >= 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`,
      };
      setScreenshots((prev) => [...prev, newScreenshot]);
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setScreenshotDragging(true);
  };

  const handleScreenshotDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setScreenshotDragging(false);
  };

  const handleScreenshotDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setScreenshotDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleScreenshotUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveScreenshot = (id: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id));
  };

  // ZIP File upload handlers
  const processZipFile = (file: File) => {
    setZipError(null);
    const validExtensions = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (
      !validExtensions.includes(file.type.toLowerCase()) &&
      fileExt !== 'zip'
    ) {
      setZipError('Invalid file type. Please select a ZIP file.');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setZipError('File too large. ZIP file must be under 500MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedZipFile({
        fileName: file.name,
        fileSize: file.size >= 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`,
        fileData: dataUrl
      });
      setZipError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processZipFile(e.target.files[0]);
    }
  };

  const handleZipDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setZipDragging(true);
  };

  const handleZipDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setZipDragging(false);
  };

  const handleZipDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setZipDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processZipFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveZip = () => {
    setUploadedZipFile(null);
    setZipError(null);
    if (zipFileInputRef.current) {
      zipFileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      category: category || 'Business',
      shortDescription,
      fullDescription,
      platforms,
      price: parseFloat(price) || 0,
      version: version || '1.0.0',
      googleDriveFile,
      googleDriveFolder,
      status,
      showOnStore,
      iconSourceType: iconUrl ? iconSourceType : undefined,
      iconFileId: iconFileId || undefined,
      iconFileName: iconFileName || undefined,
      iconMimeType: iconMimeType || undefined,
      iconSize: iconFileSize || undefined,
      iconUrl: iconUrl || undefined,
      iconType: initialApp?.iconType || 'chart',
      screenshots: screenshots.map((s) => s.url),
      // ZIP file data
      uploadedFileData: uploadedZipFile?.fileData || undefined,
      uploadedFileName: uploadedZipFile?.fileName || undefined,
      uploadedFileSize: uploadedZipFile?.fileSize || undefined,
    });
  };

  const mockDriveFiles = [
    { name: 'BusinessAnalyzer_v1.0.0_Setup.exe', size: '84.2 MB', id: '1AbC9dE_FZhK3-WIN64' },
    { name: 'LicenseGenerator_Setup.exe', size: '36.8 MB', id: '1XyZ8pQ_MNoR2-WIN64' },
    { name: 'DataManager_v1.1.0_Installer.exe', size: '52.4 MB', id: '1GhJ5kL_TuvW4-WIN64' },
    { name: 'DevToolkit_v1.0.0_Setup.exe', size: '64.0 MB', id: '1Qwe9rT_YuiO8-WIN64' },
    { name: 'SystemOptimizer_x64.exe', size: '21.5 MB', id: '1UvW3xY_HjkL7-WIN64' },
  ];

  const mockDriveFolders = [
    { name: 'FORBIDEN/Production/Windows', count: '12 files' },
    { name: 'FORBIDEN/Staging/Builds', count: '5 files' },
    { name: 'FORBIDEN/Releases/2026', count: '8 files' },
  ];

  const isIconLoaded = Boolean(iconUrl && iconUrl.trim().length > 0);

  return (
    <div id="admin-add-app-view" className="space-y-8 max-w-5xl">
      {/* Top Header with Back Arrow */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {initialApp ? 'Edit App' : 'Add New App'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm space-y-6">
          <h2 className="text-base font-semibold text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* App Name * */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                App Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter app name"
                className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>

            {/* App Category * */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                App Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 outline-none transition-all cursor-pointer"
              >
                <option value="">Select category</option>
                <option value="Business">Business</option>
                <option value="Security">Security</option>
                <option value="Productivity">Productivity</option>
                <option value="Utilities">Utilities</option>
                <option value="Development">Development</option>
                <option value="Creative Tools">Creative Tools</option>
              </select>
            </div>
          </div>

          {/* Short Description * */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Short Description *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Short description of the application"
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
            />
          </div>

          {/* Full Description * */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Full Description *
            </label>
            <textarea
              rows={4}
              required
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed description of the application"
              className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all resize-none"
            />
          </div>

          {/* ==================================================== */}
          {/* APP ICON SECTION: Upload or Google Drive Link */}
          {/* ==================================================== */}
          <div id="admin-app-icon-section" className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="block text-xs font-semibold text-slate-300">
                App Icon *
              </label>

              {/* Source Selector: [ Upload File ] [ Google Drive Link ] */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090b14] border border-slate-800">
                <button
                  type="button"
                  id="icon-source-upload-btn"
                  onClick={() => {
                    setIconSourceType('upload');
                    setDriveError(null);
                    setUploadError(null);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    iconSourceType === 'upload'
                      ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Upload size={13} />
                  <span>Upload File</span>
                </button>

                <button
                  type="button"
                  id="icon-source-drive-btn"
                  onClick={() => {
                    setIconSourceType('google_drive');
                    setDriveError(null);
                    setUploadError(null);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    iconSourceType === 'google_drive'
                      ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <HardDrive size={13} />
                  <span>Google Drive Link</span>
                </button>
              </div>
            </div>

            {/* Hidden File Input for Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* MODE 1: UPLOAD FILE MODE */}
            {iconSourceType === 'upload' && (
              <div className="space-y-3">
                {!isIconLoaded ? (
                  /* Upload dropzone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 cursor-pointer transition-all group ${
                      isDragging
                        ? 'border-purple-500 bg-purple-950/20'
                        : 'border-slate-800 hover:border-purple-500/60 bg-[#090b14]/50 hover:bg-[#090b14]'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-all shadow-inner flex-shrink-0">
                      <Upload size={24} />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <p className="text-sm font-medium text-purple-400 group-hover:text-purple-300">
                        Click to upload <span className="text-slate-400 font-normal">or drag and drop</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Supported: PNG, JPG, WEBP <span className="text-slate-500 font-normal">(512×512 px recommended, square)</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Icon Preview Card for Upload Mode */
                  <div className="rounded-2xl bg-[#090b14] border border-purple-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-purple-950/20">
                    <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                      {/* Squircle Preview */}
                      <div className="relative w-16 h-16 rounded-2xl bg-purple-950/50 border border-purple-500/30 p-2 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
                        <img
                          src={iconUrl}
                          alt="App icon preview"
                          className="w-full h-full object-contain rounded-xl"
                        />
                        <div className="absolute inset-0 bg-purple-500/5 pointer-events-none rounded-2xl" />
                      </div>

                      {/* File Details */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                            ICON PREVIEW
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Valid
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-sm">
                          {iconFileName || 'Uploaded Icon'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            Source: <span className="text-slate-200 font-medium">Upload</span>
                          </span>
                          {iconFileSize && (
                            <>
                              <span>•</span>
                              <span>{iconFileSize}</span>
                            </>
                          )}
                          {iconMimeType && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[11px]">{iconMimeType}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: Replace & Remove */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleReplaceIcon}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:text-white transition-all"
                      >
                        <RefreshCw size={13} />
                        <span>Replace</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveIcon}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 transition-all"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-300">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: GOOGLE DRIVE LINK MODE */}
            {iconSourceType === 'google_drive' && (
              <div className="space-y-4">
                {!isIconLoaded ? (
                  /* Drive Input and Load Button */
                  <div className="space-y-3 p-5 rounded-2xl bg-[#090b14] border border-slate-800">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Google Drive Icon URL *
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Link2 size={16} />
                          </div>
                          <input
                            type="text"
                            value={driveLinkInput}
                            onChange={(e) => {
                              setDriveLinkInput(e.target.value);
                              setDriveError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleLoadDriveIcon();
                              }
                            }}
                            placeholder="Paste Google Drive link here (e.g. https://drive.google.com/file/d/FILE_ID/view)"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#111422] border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                          />
                        </div>

                        <button
                          type="button"
                          id="load-drive-icon-btn"
                          onClick={() => handleLoadDriveIcon()}
                          disabled={isDriveLoading || !driveLinkInput.trim()}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-md shadow-purple-900/30 active:scale-95 transition-all whitespace-nowrap"
                        >
                          {isDriveLoading ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              <span>Validating...</span>
                            </>
                          ) : (
                            <>
                              <HardDrive size={15} />
                              <span>Load Icon</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Guidance / Accepted format examples */}
                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-800/60">
                      <p className="font-medium text-slate-400">Required: 512×512 px PNG/JPG/WEBP (square format)</p>
                      <div className="flex flex-col sm:flex-row gap-2 font-mono text-[10px] text-slate-400">
                        <span className="px-2 py-1 rounded bg-[#111422] border border-slate-800">
                          https://drive.google.com/file/d/FILE_ID/view
                        </span>
                        <span className="px-2 py-1 rounded bg-[#111422] border border-slate-800">
                          https://drive.google.com/open?id=FILE_ID
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Icon Preview Card for Google Drive Mode */
                  <div className="rounded-2xl bg-[#090b14] border border-purple-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-purple-950/20">
                    <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                      {/* Squircle Preview */}
                      <div className="relative w-16 h-16 rounded-2xl bg-purple-950/50 border border-purple-500/30 p-2 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
                        <img
                          src={iconUrl}
                          alt="App icon preview"
                          className="w-full h-full object-contain rounded-xl"
                        />
                        <div className="absolute inset-0 bg-purple-500/5 pointer-events-none rounded-2xl" />
                      </div>

                      {/* File Details */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                            ICON PREVIEW
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Valid
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-sm">
                          {iconFileName || 'drive-icon.png'}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 text-[10px] font-medium">
                            <HardDrive size={10} /> Google Drive
                          </span>
                          {iconFileId && (
                            <span className="text-slate-400 font-mono text-[11px]">
                              ID: {iconFileId.substring(0, 12)}...
                            </span>
                          )}
                          {iconFileSize && (
                            <>
                              <span>•</span>
                              <span>{iconFileSize}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: Change & Remove */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleReplaceIcon}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:text-white transition-all"
                      >
                        <RefreshCw size={13} />
                        <span>Change</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveIcon}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 transition-all"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Google Drive Error Alert Banner */}
                {driveError && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-300 animate-in fade-in">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    <span>{driveError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Supported Platforms * */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-semibold text-slate-300">
              Supported Platforms *
            </label>
            <div className="flex flex-wrap items-center gap-6">
              {['Windows', 'Android', 'macOS', 'Linux'].map((plat) => {
                const isChecked = platforms.includes(plat);
                return (
                  <label
                    key={plat}
                    className="flex items-center gap-2.5 cursor-pointer select-none text-sm text-slate-300 hover:text-white"
                  >
                    <div
                      onClick={() => handlePlatformToggle(plat)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-[#7c3aed] text-white'
                          : 'bg-slate-900 border border-slate-700'
                      }`}
                    >
                      {isChecked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>{plat}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & File + Status & Publishing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pricing & File */}
          <div className="lg:col-span-7 p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-white">
              Pricing & File
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price (USD) * */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Price (USD) *
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none transition-all"
                />
              </div>

              {/* Currency * */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none transition-all cursor-pointer"
                >
                  <option value="USD - US Dollar">USD - US Dollar</option>
                  <option value="EUR - Euro">EUR - Euro</option>
                  <option value="GBP - British Pound">GBP - British Pound</option>
                </select>
              </div>
            </div>

            {/* Version * */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Version *
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none transition-all"
              />
            </div>

            {/* Google Drive File * */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Google Drive File (Installer) *
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={googleDriveFile}
                      onChange={(e) => setGoogleDriveFile(e.target.value)}
                      placeholder="Paste Google Drive share link or file ID"
                      className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                    {googleDriveFile && handleGoogleDriveFileLink(googleDriveFile) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Valid
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetGoogleDriveFile(googleDriveFile)}
                    disabled={!googleDriveFile || !handleGoogleDriveFileLink(googleDriveFile)}
                    className={`px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      googleDriveFile && handleGoogleDriveFileLink(googleDriveFile)
                        ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500/50'
                        : 'bg-slate-800/80 text-slate-500 border-slate-700/60 cursor-not-allowed'
                    }`}
                  >
                    <Link2 size={14} className="inline mr-1" />
                    Verify
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Paste a Google Drive share link: https://drive.google.com/file/d/YOUR_FILE_ID/view
                </p>
                {googleDriveFile && (
                  <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40">
                    <p className="text-xs text-blue-300">
                      <strong>Link:</strong> {googleDriveFile.substring(0, 60)}...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Google Drive Folder (Optional) * */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Google Drive Folder (Optional) *
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={googleDriveFolder}
                      onChange={(e) => setGoogleDriveFolder(e.target.value)}
                      placeholder="Paste Google Drive folder link or folder ID"
                      className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    />
                    {googleDriveFolder && handleGoogleDriveFileLink(googleDriveFolder) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Valid
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetGoogleDriveFile(googleDriveFolder)}
                    disabled={!googleDriveFolder || !handleGoogleDriveFileLink(googleDriveFolder)}
                    className={`px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      googleDriveFolder && handleGoogleDriveFileLink(googleDriveFolder)
                        ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500/50'
                        : 'bg-slate-800/80 text-slate-500 border-slate-700/60 cursor-not-allowed'
                    }`}
                  >
                    <Link2 size={14} className="inline mr-1" />
                    Verify
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Paste a Google Drive folder link: https://drive.google.com/drive/folders/YOUR_FOLDER_ID
                </p>
                {googleDriveFolder && (
                  <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40">
                    <p className="text-xs text-blue-300">
                      <strong>Link:</strong> {googleDriveFolder.substring(0, 60)}...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Status & Publishing */}
          <div className="lg:col-span-5 p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-white">
                Status & Publishing
              </h2>

              {/* Status * */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published')}
                  className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none transition-all cursor-pointer"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Draft apps are not visible on the public store.
                </p>
              </div>

              {/* Toggle: Show on Store */}
              <div className="pt-2 flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => setShowOnStore(!showOnStore)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showOnStore ? 'bg-[#7c3aed]' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      showOnStore ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-slate-200">
                    Show on Store
                  </span>
                  <p className="text-xs text-slate-500">
                    Make this app visible on the public website
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Cancel + Save App */}
            <div className="pt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="admin-save-app-btn"
                className="px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
              >
                Save App
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: ZIP File Upload */}
        <div className="p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-white">
            Application File (ZIP Download)
          </h2>
          <p className="text-xs text-slate-400">
            Upload the ZIP file for users to download. This is stored in the database instead of Google Drive.
          </p>

          {/* Hidden ZIP file input */}
          <input
            ref={zipFileInputRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={handleZipFileChange}
            className="hidden"
          />

          {!uploadedZipFile ? (
            /* ZIP Upload Dropzone */
            <div
              onClick={() => zipFileInputRef.current?.click()}
              onDragOver={handleZipDragOver}
              onDragLeave={handleZipDragLeave}
              onDrop={handleZipDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-5 cursor-pointer transition-all group ${
                zipDragging
                  ? 'border-purple-500 bg-purple-950/20'
                  : 'border-slate-800 hover:border-purple-500/60 bg-[#090b14]/50 hover:bg-[#090b14]'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-all shadow-inner flex-shrink-0">
                <Upload size={28} />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <p className="text-sm font-medium text-purple-400 group-hover:text-purple-300">
                  Click to upload <span className="text-slate-400 font-normal">or drag and drop</span>
                </p>
                <p className="text-xs text-slate-400">
                  ZIP file <span className="text-slate-500 font-normal">(up to 500 MB)</span>
                </p>
              </div>
            </div>
          ) : (
            /* ZIP File Preview Card */
            <div className="rounded-2xl bg-[#090b14] border border-purple-900/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-purple-950/20">
              <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                {/* File Icon */}
                <div className="relative w-16 h-16 rounded-2xl bg-purple-950/50 border border-purple-500/30 p-3 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">ZIP</div>
                    <div className="text-[10px] text-purple-300 font-semibold">File</div>
                  </div>
                </div>

                {/* File Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                      ZIP FILE
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Uploaded
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-sm">
                    {uploadedZipFile.fileName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{uploadedZipFile.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons: Replace & Remove */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
                <button
                  type="button"
                  onClick={() => zipFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:text-white transition-all"
                >
                  <RefreshCw size={13} />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveZip}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 transition-all"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}

          {/* ZIP Error Banner */}
          {zipError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span>{zipError}</span>
            </div>
          )}

          {/* Info banner */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-start gap-2.5 text-xs text-blue-300">
            <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Files uploaded here will be stored in the database and served directly to users. Google Drive link is still supported as a backup option.
            </span>
          </div>
        </div>

        {/* Section 4: Screenshots Gallery */}
        <div className="p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-white">
            Application Screenshots
          </h2>
          <p className="text-xs text-slate-400">
            Upload 2-5 screenshots showcasing your application features
          </p>

          {/* Upload method tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090b14] border border-slate-800">
            <button
              type="button"
              id="screenshot-source-upload-btn"
              onClick={() => {
                setScreenshotDragging(false);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-[#7c3aed] text-white shadow-md shadow-purple-900/40"
            >
              <Upload size={13} />
              <span>Upload File</span>
            </button>

            <button
              type="button"
              id="screenshot-source-drive-btn"
              onClick={() => {
                // Toggle to Google Drive mode
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <HardDrive size={13} />
              <span>Google Drive Link</span>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={screenshotInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleScreenshotUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {/* Google Drive Links Input (5 slots) */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#090b14] border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Add Screenshots from Google Drive Links
              </label>
              <span className="text-xs text-slate-500 px-2 py-1 rounded bg-slate-900/60 border border-slate-800">
                Up to 5 screenshots
              </span>
            </div>
            
            <div className="space-y-2.5">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 w-6 text-right">{index + 1}.</span>
                  <input
                    type="text"
                    placeholder={`Screenshot ${index + 1}: https://drive.google.com/file/d/FILE_ID/view`}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-[#111422] border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const link = (e.target as HTMLInputElement).value;
                        if (link.trim()) {
                          const fileIdMatch = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
                          if (fileIdMatch && fileIdMatch[1]) {
                            const fileId = fileIdMatch[1];
                            const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                            const newScreenshot = {
                              id: 'ss-' + Math.random().toString(36).substring(2, 9),
                              url: imageUrl,
                              name: `Screenshot from Google Drive (${fileId.substring(0, 8)}...)`,
                              size: 'Remote',
                            };
                            setScreenshots((prev) => [...prev, newScreenshot]);
                            (e.target as HTMLInputElement).value = '';
                          } else {
                            alert('Invalid Google Drive link. Please use: https://drive.google.com/file/d/FILE_ID/view');
                          }
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="px-3.5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all whitespace-nowrap"
                    onClick={(e) => {
                      const input = (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement);
                      if (input && input.value.trim()) {
                        const link = input.value;
                        const fileIdMatch = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
                        if (fileIdMatch && fileIdMatch[1]) {
                          const fileId = fileIdMatch[1];
                          const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                          const newScreenshot = {
                            id: 'ss-' + Math.random().toString(36).substring(2, 9),
                            url: imageUrl,
                            name: `Screenshot from Google Drive (${fileId.substring(0, 8)}...)`,
                            size: 'Remote',
                          };
                          setScreenshots((prev) => [...prev, newScreenshot]);
                          input.value = '';
                        } else {
                          alert('Invalid Google Drive link. Please use: https://drive.google.com/file/d/FILE_ID/view');
                        }
                      }
                    }}
                  >
                    <Link2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">
              💡 Paste Google Drive link in each field and press Enter or click the link button to add screenshot
            </p>
          </div>

          {/* Upload dropzone */}
          <div
            onClick={() => screenshotInputRef.current?.click()}
            onDragOver={handleScreenshotDragOver}
            onDragLeave={handleScreenshotDragLeave}
            onDrop={handleScreenshotDrop}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 cursor-pointer transition-all group ${
              screenshotDragging
                ? 'border-purple-500 bg-purple-950/20'
                : 'border-slate-800 hover:border-purple-500/60 bg-[#090b14]/50 hover:bg-[#090b14]'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-all shadow-inner flex-shrink-0">
              <Upload size={24} />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <p className="text-sm font-medium text-purple-400 group-hover:text-purple-300">
                Click to upload <span className="text-slate-400 font-normal">or drag and drop</span>
              </p>
              <p className="text-xs text-slate-400">
                PNG, JPG, WEBP <span className="text-slate-500 font-normal">(1920x1080 recommended)</span>
              </p>
            </div>
          </div>

          {/* Screenshots Grid */}
          {screenshots.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-300">
                Uploaded Screenshots ({screenshots.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {screenshots.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 group relative"
                  >
                    <img
                      src={screenshot.url}
                      alt={screenshot.name}
                      className="w-full h-40 object-cover group-hover:brightness-75 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23374151%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%239CA3AF%22%3EImage not found%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(screenshot.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        title="Remove screenshot"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="p-3 space-y-1 bg-gradient-to-t from-slate-900/80 to-transparent">
                      <p className="text-xs font-medium text-white truncate">{screenshot.name}</p>
                      <p className="text-xs text-slate-400">{screenshot.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Google Drive Picker Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0e111d] border border-slate-700/80 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5 text-purple-400">
                <HardDrive size={20} />
                <h3 className="text-base font-bold text-white">
                  {driveModalType === 'file' ? 'Select Google Drive File' : 'Select Google Drive Folder'}
                </h3>
              </div>
              <button
                onClick={() => setShowDriveModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {driveModalType === 'file'
                ? mockDriveFiles.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setGoogleDriveFile(f.name);
                        setShowDriveModal(false);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900/70 hover:bg-purple-950/40 border border-slate-800/60 hover:border-purple-500/40 flex items-center justify-between transition-all"
                    >
                      <span className="text-sm text-slate-200 font-mono">{f.name}</span>
                      <span className="text-xs text-slate-500">{f.size}</span>
                    </button>
                  ))
                : mockDriveFolders.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setGoogleDriveFolder(f.name);
                        setShowDriveModal(false);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900/70 hover:bg-purple-950/40 border border-slate-800/60 hover:border-purple-500/40 flex items-center justify-between transition-all"
                    >
                      <span className="text-sm text-slate-200">{f.name}</span>
                      <span className="text-xs text-slate-500">{f.count}</span>
                    </button>
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
