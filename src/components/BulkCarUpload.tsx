import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CarApi, BulkUploadResult } from '../services/carApi';

interface BulkCarUploadProps {
  onUploadComplete: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

const BulkCarUpload: React.FC<BulkCarUploadProps> = ({
  onUploadComplete,
  isVisible,
  onToggle,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [results, setResults] = useState<BulkUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    setResults(null);
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setError(t('bulkUpload.fileValidation.invalidFormat'));
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('bulkUpload.fileValidation.fileTooLarge'));
      return;
    }

    setSelectedFile(file);
  };

  const handleDownloadTemplate = async () => {
    setError(null);
    setDownloading(true);
    
    try {
      await CarApi.downloadTemplate();
    } catch (err) {
      console.error('Download template failed:', err);
      setError(t('bulkUpload.downloadError'));
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setError(null);
    setUploading(true);
    
    try {
      const result = await CarApi.bulkUploadCars(selectedFile);
      setResults(result);
      
      if (result.result.success_count > 0) {
        onUploadComplete();
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(t('bulkUpload.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isVisible) {
    return (
      <div className="mb-6">
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>{t('bulkUpload.bulkUpload')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('bulkUpload.title')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('bulkUpload.description')}</p>
        </div>
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          title={t('common.hide')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Download Template Section */}
        <div className="mb-6">
          <button
            onClick={handleDownloadTemplate}
            disabled={downloading}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('bulkUpload.downloading')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('bulkUpload.downloadTemplate')}
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">{t('bulkUpload.templateHelp')}</p>
        </div>

        {/* File Upload Area */}
        <div className="mb-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
          >
            {selectedFile ? (
              <div className="space-y-3">
                <div className="text-green-600">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    ✓ {t('bulkUpload.fileValidation.ready', { fileName: selectedFile.name })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-gray-400">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('bulkUpload.dropZone')}</p>
                  <p className="text-xs text-gray-500 mt-1">{t('bulkUpload.orSelectFile')}</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Action Buttons */}
        {selectedFile && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.uploading')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {t('bulkUpload.upload')}
                </>
              )}
            </button>
            <button
              onClick={resetForm}
              disabled={uploading}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">{t('bulkUpload.results')}</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded border">
                <div className="text-2xl font-bold text-blue-600">{results.result.total_rows}</div>
                <div className="text-xs text-gray-600">{t('bulkUpload.totalRows')}</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="text-2xl font-bold text-gray-600">{results.result.processed_rows}</div>
                <div className="text-xs text-gray-600">{t('bulkUpload.processed')}</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="text-2xl font-bold text-green-600">{results.result.success_count}</div>
                <div className="text-xs text-gray-600">{t('bulkUpload.successful')}</div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div className="text-2xl font-bold text-red-600">{results.result.error_count}</div>
                <div className="text-xs text-gray-600">{t('bulkUpload.errors')}</div>
              </div>
            </div>

            {results.result.errors && results.result.errors.length > 0 && (
              <div>
                <h5 className="font-medium text-red-700 mb-3">{t('bulkUpload.errorDetails')}</h5>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {results.result.errors.map((error, index) => (
                    <div key={index} className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                      <span className="font-medium">
                        {t('bulkUpload.errorRow')} {error.row}, {error.column}:
                      </span>{' '}
                      {error.message}
                      {error.value && (
                        <span className="text-gray-600 block mt-1">
                          {t('bulkUpload.errorValue')}: "{error.value}"
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkCarUpload; 