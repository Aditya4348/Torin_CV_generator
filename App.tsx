import React, { useState, useEffect, useRef } from 'react';
import { CVData } from './types';
import { getAllCVs, createNewCV, saveCV, deleteCV, duplicateCV, generateId } from './services/storage';
import { Editor } from './components/Editor';
import { CVPreview } from './components/Preview';
import { Button, Card } from './components/UI';

type ViewState = 'dashboard' | 'editor' | 'preview';

function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = () => {
    setCvList(getAllCVs());
    setView('dashboard');
    setCurrentCV(null);
  };

  const handleCreate = () => {
    const newCV = createNewCV();
    setCurrentCV(newCV);
    setView('editor');
  };

  const handleEdit = (cv: CVData) => {
    setCurrentCV(cv);
    setView('editor');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this CV?')) {
      deleteCV(id);
      loadDashboard();
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      duplicateCV(id);
      loadDashboard();
  };

  const handleEditorSave = (updatedCV: CVData) => {
    setCurrentCV(updatedCV);
    saveCV(updatedCV); // Autosave to local storage
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current || !currentCV) return;
    
    setIsDownloading(true);

    const element = printRef.current;
    const filename = `${currentCV.title.replace(/\s+/g, '_')}_CV.pdf`;

    // html2pdf options
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore - html2pdf loaded via CDN
      await window.html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // DASHBOARD VIEW
  // ---------------------------------------------------------------------------
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">THORIN CV Forge<span className="text-indigo-500">.</span></h1>
              <p className="text-gray-500 mt-2">Create ATS-friendly resumes in minutes. No sign-up required.</p>
            </div>
            <Button onClick={handleCreate} className="shadow-xl shadow-indigo-200">
              <span className="text-lg mr-2">+</span> New Resume
            </Button>
          </header>

          {cvList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-900">No CVs yet</h3>
              <p className="text-gray-500 mb-6">Start fresh by creating your first resume.</p>
              <Button onClick={handleCreate}>Create Resume</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvList.sort((a,b) => b.lastModified - a.lastModified).map(cv => (
                <div 
                  key={cv.id} 
                  onClick={() => handleEdit(cv)}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all cursor-pointer flex flex-col h-60"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-500 uppercase">{cv.templateId}</div>
                      <span className="text-xs text-gray-400">{new Date(cv.lastModified).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{cv.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{cv.personalInfo.fullName || 'Untitled'}</p>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" className="px-3 py-1 text-xs" onClick={(e) => handleDuplicate(cv.id, e)}>Copy</Button>
                    <Button variant="danger" className="px-3 py-1 text-xs" onClick={(e) => handleDelete(cv.id, e)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // EDITOR VIEW
  // ---------------------------------------------------------------------------
  if (view === 'editor' && currentCV) {
    return (
       // Screen wrapper
      <div className="h-screen w-full flex overflow-hidden">
        {/* Left: Editor Form (Full width on mobile, 50% on desktop) */}
        <div className="w-full lg:w-1/2 h-full border-r border-gray-200 bg-white relative z-10">
          <Editor 
            cv={currentCV} 
            onSave={handleEditorSave} 
            onBack={loadDashboard}
            onPreview={() => setView('preview')}
          />
        </div>

        {/* Right: Live Preview (Hidden on mobile, visible on desktop) */}
        <div className="hidden lg:block w-1/2 h-full bg-gray-100 p-8 overflow-y-auto relative">
           <div className="sticky top-0 z-20 flex justify-end mb-4 gap-2 no-print">
              <Button onClick={() => setView('preview')}>Fullscreen / Download</Button>
           </div>
           <div className="origin-top transform scale-[0.65] xl:scale-[0.85] transition-transform duration-300 shadow-2xl">
             <CVPreview data={currentCV} />
           </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // FULLSCREEN PREVIEW / PRINT VIEW
  // ---------------------------------------------------------------------------
  if (view === 'preview' && currentCV) {
    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center py-10 relative">
        {/* Toolbar - Hidden when printing */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl rounded-full px-6 py-3 z-50 flex items-center gap-4 no-print border border-gray-200">
          <Button variant="ghost" onClick={() => setView('editor')}>← Edit</Button>
          <div className="w-px h-6 bg-gray-300"></div>
          <Button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>

        {/* Print Area */}
        <div id="cv-preview-container" className="bg-white shadow-2xl print-only" ref={printRef}>
          <CVPreview data={currentCV} />
        </div>
        
        <p className="text-gray-400 mt-8 text-sm no-print">
          Layout is optimized for A4 paper size.
        </p>
      </div>
    );
  }

  return null;
}

export default App;