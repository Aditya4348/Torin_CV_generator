import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { CVData } from '../types';

interface PreviewProps {
  data: CVData;
}

const DateRange = ({ start, end, current }: { start: string, end: string, current: boolean }) => {
  const formatDate = (d: string) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  return (
    <span className="whitespace-nowrap">
      {formatDate(start)} – {current ? 'Present' : formatDate(end)}
    </span>
  );
};

// ----------------------------------------------------------------------
// TEMPLATES (Refactored to be "Splittable" / Flat Structure)
// ----------------------------------------------------------------------

// Shared Styles
const PAGE_A4_CLASS = "bg-white shadow-2xl mx-auto mb-8 overflow-hidden relative";
const A4_HEIGHT_PX = 1123; // A4 at 96 DPI approx
const CONTENT_HEIGHT_PX = 1050; // Leave some margin for safety

// We need a helper to ensure sections identify themselves as blocks
const Block = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`cv-block ${className}`}>{children}</div>
);

// --- ATS MINIMAL ---
const ATSMinimalContent: React.FC<{ data: CVData }> = ({ data }) => {
  return (
    <>
      {/* Header */}
      <Block className="border-b-2 border-gray-900 pb-4 mb-6 pt-8 px-8 flex justify-between items-start gap-6">
        <div className="flex-1 text-center">
             <h1 className="text-3xl font-bold uppercase tracking-wide">{data.personalInfo.fullName}</h1>
             <div className="text-center mt-2 text-sm flex flex-wrap justify-center gap-x-4 gap-y-1">
                {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.links.map(l => (
                    <span key={l.id}><a href={l.url} className="underline" target="_blank" rel="noreferrer">{l.url}</a></span>
                ))}
            </div>
        </div>
        {data.personalInfo.photo && (
            <img src={data.personalInfo.photo} alt="Profile" className="w-24 h-32 object-cover border border-gray-200 shadow-sm flex-shrink-0" />
        )}
      </Block>

      {/* Summary */}
      {data.summary && (
        <Block className="mb-6 px-8">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Professional Summary</h2>
          <p className="text-sm text-justify leading-snug">{data.summary}</p>
        </Block>
      )}

      {/* Experience Header */}
      {data.experience.length > 0 && (
        <Block className="px-8 mb-3">
             <h2 className="text-sm font-bold uppercase border-b border-gray-300">Experience</h2>
        </Block>
      )}
      
      {/* Experience Items (Individual Blocks) */}
      {data.experience.map(exp => (
        <Block key={exp.id} className="mb-4 px-8 break-inside-avoid">
            <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base">{exp.title}</h3>
                <div className="text-sm font-medium"><DateRange start={exp.startDate} end={exp.endDate} current={exp.current} /></div>
            </div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm italic font-medium">{exp.company}</span>
                <span className="text-sm text-gray-600">{exp.location}</span>
            </div>
            <div className="text-sm ml-4">
                <ul className="list-disc space-y-1">
                {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i}>{line}</li>
                ))}
                </ul>
            </div>
        </Block>
      ))}

      {/* Projects Header */}
      {data.projects && data.projects.length > 0 && (
         <Block className="px-8 mb-3">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300">Projects</h2>
        </Block>
      )}

      {/* Project Items */}
      {data.projects.map(proj => (
          <Block key={proj.id} className="mb-3 px-8 break-inside-avoid">
            <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base">{proj.title}</h3>
                {proj.link && <a href={`https://${proj.link}`} target="_blank" className="text-xs text-blue-800 underline">{proj.link}</a>}
            </div>
            <p className="text-sm mt-1 leading-snug">{proj.description}</p>
          </Block>
      ))}

      {/* Education Header */}
      {data.education.length > 0 && (
         <Block className="px-8 mb-3">
          <h2 className="text-sm font-bold uppercase border-b border-gray-300">Education</h2>
         </Block>
      )}

      {/* Education Items */}
      {data.education.map(edu => (
        <Block key={edu.id} className="mb-3 px-8 break-inside-avoid">
            <div className="flex justify-between font-bold text-sm">
                <span>{edu.school}</span>
                <DateRange start={edu.startDate} end={edu.endDate} current={false} />
            </div>
            <div className="text-sm">{edu.degree}</div>
        </Block>
      ))}

      {/* Skills/Extras */}
      <Block className="mb-6 px-8 mt-4">
        <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Additional Information</h2>
        {data.skills.length > 0 && (
          <div className="mb-2 text-sm"><span className="font-bold">Skills:</span> {data.skills.join(', ')}</div>
        )}
        {data.languages && data.languages.length > 0 && (
          <div className="mb-2 text-sm"><span className="font-bold">Languages:</span> {data.languages.join(', ')}</div>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <div className="text-sm"><span className="font-bold">Certifications:</span> {data.certifications.join(', ')}</div>
        )}
      </Block>
    </>
  );
};

// --- ATS MODERN ---
const ATSModernContent: React.FC<{ data: CVData }> = ({ data }) => {
  return (
    <>
      <Block className="mb-8 flex items-start gap-6 pt-10 px-10">
        {data.personalInfo.photo && (
            <img src={data.personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md flex-shrink-0" />
        )}
        <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-1">{data.personalInfo.fullName}</h1>
            <p className="text-xl text-indigo-600 font-medium mb-3">{data.personalInfo.jobTitle}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {data.personalInfo.email && <div className="flex items-center gap-1">✉️ {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div className="flex items-center gap-1">📱 {data.personalInfo.phone}</div>}
            {data.personalInfo.location && <div className="flex items-center gap-1">📍 {data.personalInfo.location}</div>}
            {data.personalInfo.links.map(l => (
                <div key={l.id} className="flex items-center gap-1">🔗 <a href={l.url} className="hover:text-indigo-600">{l.url}</a></div>
            ))}
            </div>
        </div>
      </Block>

      {data.summary && (
        <Block className="mb-8 px-10">
          <p className="text-sm leading-relaxed text-slate-700">{data.summary}</p>
        </Block>
      )}

      {data.experience.length > 0 && (
        <Block className="px-10 mb-4">
             <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-100 pb-1">Work Experience</h2>
        </Block>
      )}
      
      {data.experience.map(exp => (
        <Block key={exp.id} className="mb-6 px-10">
            <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-900">{exp.title}</h3>
                <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                <DateRange start={exp.startDate} end={exp.endDate} current={exp.current} />
                </span>
            </div>
            <div className="text-sm font-medium text-slate-600 mb-2">{exp.company} • {exp.location}</div>
            <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-slate-700 marker:text-indigo-300">
                {exp.description.split('\n').filter(Boolean).map((line, i) => (
                <li key={i}>{line}</li>
                ))}
            </ul>
        </Block>
      ))}

      {data.projects && data.projects.length > 0 && (
         <Block className="px-10 mb-4">
           <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-100 pb-1">Projects</h2>
         </Block>
      )}
      {data.projects.map(proj => (
         <Block key={proj.id} className="mb-4 px-10">
             <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-slate-900">{proj.title}</h3>
                {proj.link && <a href={`https://${proj.link}`} className="text-xs text-indigo-500 hover:underline">{proj.link}</a>}
             </div>
             <p className="text-sm text-slate-700">{proj.description}</p>
         </Block>
      ))}

      {data.education.length > 0 && (
         <Block className="px-10 mb-4">
           <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-100 pb-1">Education</h2>
         </Block>
      )}
      {data.education.map(edu => (
         <Block key={edu.id} className="mb-4 px-10">
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-slate-900">{edu.school}</h3>
                <span className="text-xs text-slate-500"><DateRange start={edu.startDate} end={edu.endDate} current={false} /></span>
            </div>
            <div className="text-sm text-slate-700">{edu.degree}</div>
         </Block>
      ))}

      <Block className="px-10 mt-6 pb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4 border-b-2 border-indigo-100 pb-1">Skills & Certifications</h2>
        <div className="space-y-3">
            {data.skills.length > 0 && (
                <div>
                   <h3 className="text-sm font-bold text-slate-900 mb-2">Technical Skills</h3>
                   <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                    <span key={i} className="text-sm border border-slate-200 px-3 py-1 rounded-full text-slate-700">{skill}</span>
                    ))}
                   </div>
                </div>
            )}
             {data.languages && data.languages.length > 0 && (
                <div className="text-sm text-slate-700 mt-2"><span className="font-bold">Languages:</span> {data.languages.join(' • ')}</div>
            )}
            {data.certifications && data.certifications.length > 0 && (
                <div className="text-sm text-slate-700 mt-2"><span className="font-bold">Certifications:</span> {data.certifications.join(' • ')}</div>
            )}
        </div>
      </Block>
    </>
  );
};

// --- ATS PROFESSIONAL ---
const ATSProfessionalContent: React.FC<{ data: CVData }> = ({ data }) => {
  return (
    <>
      <Block className="flex gap-8 mb-8 items-center border-b border-gray-200 pb-8 pt-12 px-12">
        {data.personalInfo.photo && (
            <img src={data.personalInfo.photo} alt="Profile" className="w-28 h-32 object-cover rounded shadow-sm" />
        )}
        <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{data.personalInfo.fullName}</h1>
            <p className="text-lg text-gray-600 mt-1 mb-4">{data.personalInfo.jobTitle}</p>
             <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                {data.personalInfo.phone && <span className="border-l border-gray-300 pl-4">{data.personalInfo.phone}</span>}
                {data.personalInfo.location && <span className="border-l border-gray-300 pl-4">{data.personalInfo.location}</span>}
            </div>
        </div>
      </Block>

      {data.summary && (
        <Block className="mb-6 px-12">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Profile</h2>
            <p className="text-sm leading-6 text-gray-700">{data.summary}</p>
        </Block>
      )}

      {data.experience.length > 0 && (
        <Block className="px-12 mb-4">
           <h2 className="text-lg font-bold text-gray-900">Experience</h2>
        </Block>
      )}
      {data.experience.map(exp => (
        <Block key={exp.id} className="relative pl-4 border-l-2 border-gray-200 ml-12 mb-6 mr-12">
            <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
            <h3 className="font-bold text-gray-900">{exp.title}</h3>
            <span className="text-xs font-mono text-gray-500"><DateRange start={exp.startDate} end={exp.endDate} current={exp.current} /></span>
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {exp.description.split('\n').filter(Boolean).map((line, i) => (
                <li key={i}><span className="-ml-2">{line}</span></li>
            ))}
            </ul>
        </Block>
      ))}

      {data.projects && data.projects.length > 0 && (
         <Block className="px-12 mb-4">
             <h2 className="text-lg font-bold text-gray-900">Projects</h2>
         </Block>
      )}
      {/* Projects Grid trick: we can't do real grid in paginated mode nicely, so we stack blocks but make them look compact */}
      {data.projects.map(proj => (
         <Block key={proj.id} className="bg-gray-50 p-4 rounded mb-4 mx-12">
            <div className="font-bold text-sm text-gray-900">{proj.title}</div>
            <div className="text-xs text-gray-600 mt-1">{proj.description}</div>
         </Block>
      ))}

      {data.education.length > 0 && (
        <Block className="px-12 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Education</h2>
        </Block>
      )}
      {data.education.map(edu => (
         <Block key={edu.id} className="mb-4 px-12">
            <div className="font-bold text-sm">{edu.school}</div>
            <div className="text-sm text-gray-600">{edu.degree}</div>
            <div className="text-xs text-gray-500 mt-1"><DateRange start={edu.startDate} end={edu.endDate} current={false} /></div>
         </Block>
      ))}

      <Block className="px-12 mt-6 pb-12">
         {data.skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-x-2 gap-y-2">
                {data.skills.map((skill, i) => (
                    <span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{skill}</span>
                ))}
            </div>
          </div>
         )}
         
         {data.certifications && data.certifications.length > 0 && (
           <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Certifications</h2>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {data.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
              </ul>
           </div>
         )}
      </Block>
    </>
  );
};

// ----------------------------------------------------------------------
// PAGINATION CONTROLLER
// ----------------------------------------------------------------------


export const CVPreview: React.FC<PreviewProps> = ({ data }) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  // Pilih template
  const ContentComponent =
    data.templateId === 'modern'
      ? ATSModernContent
      : data.templateId === 'professional'
      ? ATSProfessionalContent
      : ATSMinimalContent;

  const fontClass =
    data.templateId === 'modern'
      ? 'font-sans'
      : data.templateId === 'professional'
      ? 'font-inter'
      : 'font-serif';

  useLayoutEffect(() => {
    if (!sourceRef.current || !targetRef.current) return;

    const source = sourceRef.current;
    const target = targetRef.current;

    // 🔒 Clear target dengan aman
    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }

    // Buat halaman pertama
    let currentPage = document.createElement('div');
    currentPage.className = PAGE_A4_CLASS;
    currentPage.style.width = '210mm';
    currentPage.style.minHeight = '297mm';
    currentPage.style.position = 'relative';

    target.appendChild(currentPage);

    let currentHeight = 0;
    const blocks = Array.from(source.children) as HTMLElement[];

    blocks.forEach((block) => {
      const clone = block.cloneNode(true) as HTMLElement;
      currentPage.appendChild(clone);

      const blockHeight = clone.offsetHeight;

      if (currentHeight + blockHeight > CONTENT_HEIGHT_PX) {
        // overflow → pindah halaman
        currentPage.removeChild(clone);

        currentPage = document.createElement('div');
        currentPage.className = PAGE_A4_CLASS;
        currentPage.style.width = '210mm';
        currentPage.style.minHeight = '297mm';
        currentPage.style.position = 'relative';

        target.appendChild(currentPage);
        currentHeight = 0;
        currentPage.appendChild(clone);
      }

      currentHeight += blockHeight;
    });
  }, [data]);

  return (
    <div className={fontClass}>
      {/* SOURCE (hidden, hanya untuk ukur tinggi) */}
      <div
        ref={sourceRef}
        className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none w-[210mm]"
        aria-hidden="true"
      >
        <ContentComponent data={data} />
      </div>

      {/* TARGET (React TIDAK mengatur isinya) */}
      <div
        ref={targetRef}
        className="flex flex-col items-center"
        suppressHydrationWarning
      />
    </div>
  );
};
