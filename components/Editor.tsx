import React, { useState, useEffect, useRef } from 'react';
import { CVData, Experience, Education, Project } from '../types';
import { Button, Input, TextArea, Card } from './UI';
import { generateId } from '../services/storage';

interface EditorProps {
  cv: CVData;
  onSave: (cv: CVData) => void;
  onBack: () => void;
  onPreview: () => void;
}

interface SectionProps {
  data: CVData;
  onChange: (newData: CVData) => void;
}

const STEPS = [
  { id: 'basics', label: 'Basics' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'languages', label: 'Languages' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'template', label: 'Design' },
];

// --- SAMPLE DATA GENERATORS ---

const getEnglishSampleData = (currentData: CVData): CVData => ({
  ...currentData,
  personalInfo: {
    ...currentData.personalInfo,
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 0123-4567',
    location: 'San Francisco, CA',
    links: [
      { id: generateId(), platform: 'LinkedIn', url: 'linkedin.com/in/alexmorgan' },
      { id: generateId(), platform: 'Portfolio', url: 'alexmorgan.design' }
    ]
  },
  summary: 'Creative and detail-oriented Product Designer with over 6 years of experience in building user-centric digital products. Proficient in translating complex requirements into intuitive and visually appealing designs. Strong background in UX research, prototyping, and cross-functional collaboration.',
  experience: [
    {
      id: generateId(),
      title: 'Senior Product Designer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      startDate: '2021-03-01',
      endDate: '',
      current: true,
      description: 'Lead the design of the core SaaS platform, resulting in a 25% increase in user engagement.\nMentored junior designers and established a unified design system used across 4 products.\nCollaborated closely with engineering and product management to define product roadmap and feature specifications.'
    },
    {
      id: generateId(),
      title: 'UX Designer',
      company: 'Creative Pulse Agency',
      location: 'Austin, TX',
      startDate: '2018-06-01',
      endDate: '2021-02-01',
      current: false,
      description: 'Designed responsive websites and mobile apps for diverse clients in fintech and healthcare.\nConducted user research, usability testing, and stakeholder interviews to inform design decisions.\nCreated high-fidelity wireframes and interactive prototypes using Figma and Adobe XD.'
    }
  ],
  education: [
    {
      id: generateId(),
      school: 'University of Texas at Austin',
      degree: 'Bachelor of Fine Arts in Design',
      startDate: '2014-09-01',
      endDate: '2018-05-01',
      description: ''
    }
  ],
  projects: [
    {
      id: generateId(),
      title: 'EcoTrack Mobile App',
      link: 'behance.net/ecotrack',
      description: 'Designed a personal carbon footprint tracking app. Featured on App Store "Apps we Love".'
    },
    {
      id: generateId(),
      title: 'Fintech Dashboard Redesign',
      link: 'dribbble.com/alex/fintech',
      description: 'Complete overhaul of a legacy banking dashboard, improving task completion rate by 40%.'
    }
  ],
  skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'HTML/CSS', 'Agile Methodology'],
  languages: ['English (Native)', 'Spanish (Conversational)'],
  certifications: ['Google UX Design Professional Certificate', 'Certified Scrum Master (CSM)']
});

const getIndonesianSampleData = (currentData: CVData): CVData => ({
  ...currentData,
  personalInfo: {
    ...currentData.personalInfo,
    fullName: 'Budi Santoso',
    jobTitle: 'Senior Product Designer',
    email: 'budi.santoso@example.com',
    phone: '+62 812 3456 7890',
    location: 'Jakarta, Indonesia',
    links: [
      { id: generateId(), platform: 'LinkedIn', url: 'linkedin.com/in/budisantoso' },
      { id: generateId(), platform: 'Portfolio', url: 'budisantoso.design' }
    ]
  },
  summary: 'Desainer Produk yang kreatif dan berorientasi pada detail dengan pengalaman lebih dari 6 tahun dalam membangun produk digital yang berpusat pada pengguna. Mahir dalam menerjemahkan kebutuhan kompleks menjadi desain yang intuitif dan menarik secara visual. Memiliki latar belakang yang kuat dalam riset UX, pembuatan prototipe, dan kolaborasi lintas fungsi.',
  experience: [
    {
      id: generateId(),
      title: 'Senior Product Designer',
      company: 'Teknologi Nusantara',
      location: 'Jakarta Selatan',
      startDate: '2021-03-01',
      endDate: '',
      current: true,
      description: 'Memimpin desain platform SaaS inti, menghasilkan peningkatan keterlibatan pengguna sebesar 25%.\nMembimbing desainer junior dan menetapkan sistem desain terpadu yang digunakan di 4 produk.\nBekerja sama dengan tim teknik dan manajemen produk untuk menentukan peta jalan produk dan spesifikasi fitur.'
    },
    {
      id: generateId(),
      title: 'UX Designer',
      company: 'Agensi Kreatif Maju',
      location: 'Bandung',
      startDate: '2018-06-01',
      endDate: '2021-02-01',
      current: false,
      description: 'Merancang situs web responsif dan aplikasi seluler untuk berbagai klien di bidang fintech dan kesehatan.\nMelakukan riset pengguna, pengujian kegunaan, dan wawancara pemangku kepentingan untuk menginformasikan keputusan desain.\nMembuat kerangka gambar fidelitas tinggi dan prototipe interaktif menggunakan Figma dan Adobe XD.'
    }
  ],
  education: [
    {
      id: generateId(),
      school: 'Universitas Indonesia',
      degree: 'Sarjana Desain Komunikasi Visual',
      startDate: '2014-09-01',
      endDate: '2018-05-01',
      description: ''
    }
  ],
  projects: [
    {
      id: generateId(),
      title: 'Aplikasi EcoTrack',
      link: 'behance.net/ecotrack',
      description: 'Merancang aplikasi pelacakan jejak karbon pribadi. Ditampilkan di App Store "Apps we Love".'
    },
    {
      id: generateId(),
      title: 'Desain Ulang Dashboard Fintech',
      link: 'dribbble.com/budi/fintech',
      description: 'Pembaruan menyeluruh dashboard perbankan lama, meningkatkan tingkat penyelesaian tugas sebesar 40%.'
    }
  ],
  skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'Riset Pengguna', 'HTML/CSS', 'Metodologi Agile'],
  languages: ['Bahasa Indonesia (Native)', 'Bahasa Inggris (Professional)'],
  certifications: ['Sertifikat Profesional UX Design Google', 'Certified Scrum Master (CSM)']
});

// --- SUB-COMPONENTS (MOVED OUTSIDE) ---

const BasicsForm: React.FC<SectionProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit size to 500KB to protect LocalStorage quota
      if (file.size > 500 * 1024) {
        alert("File size is too large! Please upload an image smaller than 500KB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ 
          ...data, 
          personalInfo: { ...data.personalInfo, photo: reader.result as string } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onChange({ 
      ...data, 
      personalInfo: { ...data.personalInfo, photo: '' } 
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Photo Upload Section */}
        <div className="w-full md:w-auto flex flex-col items-center gap-3">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden relative group">
            {data.personalInfo.photo ? (
              <>
                <img src={data.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <span className="text-white text-xs font-bold">Change</span>
                </div>
              </>
            ) : (
              <span className="text-gray-400 text-xs text-center px-2">No Photo</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="px-3 py-1 text-xs" onClick={() => fileInputRef.current?.click()}>
              {data.personalInfo.photo ? 'Change' : 'Upload Photo'}
            </Button>
            {data.personalInfo.photo && (
              <Button variant="danger" className="px-3 py-1 text-xs" onClick={removePhoto}>Remove</Button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handlePhotoUpload}
          />
          <p className="text-[10px] text-gray-400 text-center max-w-[150px]">Max 500KB. JPG/PNG. Professional headshot recommended.</p>
        </div>

        {/* Text Inputs */}
        <div className="flex-1 w-full space-y-4">
           <Input label="CV Name (Internal)" value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
           <Input label="Full Name" value={data.personalInfo.fullName} onChange={e => onChange({ ...data, personalInfo: { ...data.personalInfo, fullName: e.target.value } })} placeholder="John Doe" />
           <Input label="Job Title" value={data.personalInfo.jobTitle} onChange={e => onChange({ ...data, personalInfo: { ...data.personalInfo, jobTitle: e.target.value } })} placeholder="Frontend Developer" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email" type="email" value={data.personalInfo.email} onChange={e => onChange({ ...data, personalInfo: { ...data.personalInfo, email: e.target.value } })} />
        <Input label="Phone" type="tel" value={data.personalInfo.phone} onChange={e => onChange({ ...data, personalInfo: { ...data.personalInfo, phone: e.target.value } })} />
        <Input label="Location" value={data.personalInfo.location} onChange={e => onChange({ ...data, personalInfo: { ...data.personalInfo, location: e.target.value } })} placeholder="City, Country" />
      </div>
      
      <div className="pt-4 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Social Links</label>
        {data.personalInfo.links.map((link, idx) => (
          <div key={link.id} className="flex gap-2 mb-2">
            <Input placeholder="URL (LinkedIn, GitHub...)" value={link.url} onChange={e => {
                const newLinks = [...data.personalInfo.links];
                newLinks[idx].url = e.target.value;
                onChange({ ...data, personalInfo: { ...data.personalInfo, links: newLinks } });
            }} />
             <Button variant="danger" onClick={() => onChange({ ...data, personalInfo: { ...data.personalInfo, links: data.personalInfo.links.filter(l => l.id !== link.id) } })}>X</Button>
          </div>
        ))}
        <Button variant="secondary" onClick={() => onChange({ ...data, personalInfo: { ...data.personalInfo, links: [...data.personalInfo.links, { id: generateId(), platform: 'Web', url: '' }] } })}>+ Add Link</Button>
      </div>
    </div>
  );
};

const SummaryForm: React.FC<SectionProps> = ({ data, onChange }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <TextArea label="Professional Summary" className="h-64" placeholder="Briefly describe your professional background..." value={data.summary} onChange={e => onChange({ ...data, summary: e.target.value })} />
  </div>
);

const ExperienceForm: React.FC<SectionProps> = ({ data, onChange }) => {
  const updateExp = (index: number, field: keyof Experience, value: any) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experience: newExp });
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button onClick={() => onChange({ ...data, experience: [{ id: generateId(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }, ...data.experience] })} className="w-full py-4 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-900 hover:text-gray-900">+ Add Position</Button>
      {data.experience.map((exp, idx) => (
        <Card key={exp.id} className="p-4 relative group">
          <button onClick={() => onChange({ ...data, experience: data.experience.filter(e => e.id !== exp.id) })} className="absolute right-4 top-4 text-red-400 hover:text-red-600">🗑</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Title" value={exp.title} onChange={e => updateExp(idx, 'title', e.target.value)} />
            <Input label="Company" value={exp.company} onChange={e => updateExp(idx, 'company', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Start" type="date" value={exp.startDate} onChange={e => updateExp(idx, 'startDate', e.target.value)} />
              <div className="flex flex-col"><Input label="End" type="date" disabled={exp.current} value={exp.endDate} onChange={e => updateExp(idx, 'endDate', e.target.value)} /><label className="flex items-center gap-2 mt-2 text-xs font-semibold"><input type="checkbox" checked={exp.current} onChange={e => updateExp(idx, 'current', e.target.checked)} /> Present</label></div>
            </div>
            <Input label="Location" value={exp.location} onChange={e => updateExp(idx, 'location', e.target.value)} />
          </div>
          <TextArea label="Description" value={exp.description} onChange={e => updateExp(idx, 'description', e.target.value)} />
        </Card>
      ))}
    </div>
  );
};

const EducationForm: React.FC<SectionProps> = ({ data, onChange }) => {
  const updateEdu = (index: number, field: keyof Education, value: any) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, education: newEdu });
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button onClick={() => onChange({ ...data, education: [{ id: generateId(), school: '', degree: '', startDate: '', endDate: '', description: '' }, ...data.education] })} className="w-full py-4 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-900 hover:text-gray-900">+ Add Education</Button>
        {data.education.map((edu, idx) => (
        <Card key={edu.id} className="p-4 relative group">
            <button onClick={() => onChange({...data, education: data.education.filter(e => e.id !== edu.id)})} className="absolute right-4 top-4 text-red-400 hover:text-red-600">🗑</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="School" value={edu.school} onChange={e => updateEdu(idx, 'school', e.target.value)} />
                <Input label="Degree" value={edu.degree} onChange={e => updateEdu(idx, 'degree', e.target.value)} />
                <Input label="Start" type="date" value={edu.startDate} onChange={e => updateEdu(idx, 'startDate', e.target.value)} />
                <Input label="End" type="date" value={edu.endDate} onChange={e => updateEdu(idx, 'endDate', e.target.value)} />
            </div>
        </Card>
        ))}
    </div>
  );
};

const ProjectsForm: React.FC<SectionProps> = ({ data, onChange }) => {
  const updateProj = (index: number, field: keyof Project, value: any) => {
    const newProj = [...data.projects];
    newProj[index] = { ...newProj[index], [field]: value };
    onChange({ ...data, projects: newProj });
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button onClick={() => onChange({ ...data, projects: [{ id: generateId(), title: '', link: '', description: '' }, ...data.projects] })} className="w-full py-4 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-900 hover:text-gray-900">+ Add Project</Button>
        {data.projects.map((proj, idx) => (
        <Card key={proj.id} className="p-4 relative group">
            <button onClick={() => onChange({...data, projects: data.projects.filter(p => p.id !== proj.id)})} className="absolute right-4 top-4 text-red-400 hover:text-red-600">🗑</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Project Title" value={proj.title} onChange={e => updateProj(idx, 'title', e.target.value)} />
                <Input label="Link" value={proj.link} onChange={e => updateProj(idx, 'link', e.target.value)} />
            </div>
            <TextArea label="Description" value={proj.description} onChange={e => updateProj(idx, 'description', e.target.value)} />
        </Card>
        ))}
    </div>
  );
};

// Reusable List Form for Skills, Languages, Certs
const ListForm: React.FC<{ items: string[], onChange: (items: string[]) => void, placeholder: string }> = ({ items, onChange, placeholder }) => {
  const [input, setInput] = useState('');
  const addItem = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && input.trim()) {
          e.preventDefault();
          if(!items.includes(input.trim())) {
              onChange([...items, input.trim()]);
          }
          setInput('');
      }
  };
  return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4">
              <Input label={`Add Item (Press Enter)`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={addItem} placeholder={placeholder} />
          </div>
          <div className="flex flex-wrap gap-2">
              {items.map(item => (
                  <span key={item} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item}
                      <button onClick={() => onChange(items.filter(i => i !== item))} className="ml-2 hover:text-indigo-900">×</button>
                  </span>
              ))}
          </div>
      </div>
  );
};

const TemplateForm: React.FC<SectionProps> = ({ data, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {[
          { id: 'minimal', name: 'ATS Minimal', desc: 'Classic & Safe' },
          { id: 'modern', name: 'ATS Modern', desc: 'Clean & Sharp' },
          { id: 'professional', name: 'Professional', desc: 'Structured' },
      ].map(t => (
          <button key={t.id} onClick={() => onChange({ ...data, templateId: t.id as any })} className={`text-left p-4 rounded-xl border-2 transition-all ${data.templateId === t.id ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="font-bold text-gray-900">{t.name}</div>
              <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
          </button>
      ))}
  </div>
);

// --- MAIN COMPONENT ---

export const Editor: React.FC<EditorProps> = ({ cv, onSave, onBack, onPreview }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<CVData>(cv);
  const [showAutoFillMenu, setShowAutoFillMenu] = useState(false);
  const autoFillMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autoFillMenuRef.current && !autoFillMenuRef.current.contains(event.target as Node)) {
        setShowAutoFillMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (newData: CVData) => {
    setData(newData);
    onSave(newData);
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const handleAutoFill = (lang: 'en' | 'id') => {
    const msg = lang === 'en' 
      ? 'Auto-fill with English sample data? Current inputs will be overwritten.'
      : 'Isi otomatis dengan data contoh Bahasa Indonesia? Input saat ini akan tertimpa.';
    
    if (confirm(msg)) {
      const sampleData = lang === 'en' ? getEnglishSampleData(data) : getIndonesianSampleData(data);
      handleChange(sampleData);
    }
    setShowAutoFillMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-2 md:p-4 flex justify-between items-center sticky top-0 z-20 gap-2">
        <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onBack} className="px-2 md:px-4 text-xs md:text-sm">← <span className="hidden sm:inline">Dashboard</span></Button>
            <span className="md:hidden text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{activeStep + 1}/{STEPS.length}</span>
        </div>
        <div className="hidden md:flex gap-2">
           {STEPS.map((s, i) => <div key={s.id} className={`h-2 w-8 rounded-full transition-colors ${i <= activeStep ? 'bg-indigo-600' : 'bg-gray-200'}`} title={s.label} />)}
        </div>
        <div className="flex items-center gap-2">
            <div className="relative flex items-center shadow-sm rounded-xl" ref={autoFillMenuRef}>
              <div className="inline-flex rounded-xl shadow-sm isolate">
                <button type="button" onClick={() => handleAutoFill('en')} className="relative inline-flex items-center gap-x-1.5 rounded-l-xl bg-white px-3 py-2 text-sm font-semibold text-amber-600 ring-1 ring-inset ring-amber-200 hover:bg-amber-50 focus:z-10">✨ <span className="hidden sm:inline">Auto Fill</span></button>
                <button type="button" onClick={() => setShowAutoFillMenu(!showAutoFillMenu)} className="relative -ml-px inline-flex items-center rounded-r-xl bg-white px-2 py-2 text-amber-600 ring-1 ring-inset ring-amber-200 hover:bg-amber-50 focus:z-10">
                  <span className="sr-only">Open options</span><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                </button>
              </div>
              {showAutoFillMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase">Select Language</div>
                  <button onClick={() => handleAutoFill('en')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg flex items-center gap-2">🇺🇸 English</button>
                  <button onClick={() => handleAutoFill('id')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg flex items-center gap-2">🇮🇩 Indonesia</button>
                </div>
              )}
            </div>
            <Button variant="secondary" className="md:hidden px-3 text-xs" onClick={onPreview}>👁</Button>
            <div className="hidden md:block text-xs text-gray-400 font-mono">Autosaved</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        <div className="w-64 bg-white border-r border-gray-200 hidden md:block overflow-y-auto p-6">
            <h2 className="font-bold text-gray-900 mb-6 px-2">Sections</h2>
            <nav className="space-y-1">
                {STEPS.map((step, idx) => (
                    <button key={step.id} onClick={() => setActiveStep(idx)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeStep === idx ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>{step.label}</button>
                ))}
            </nav>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{STEPS[activeStep].label}</h1>
                <p className="text-gray-500 mb-8 text-sm">Fill in the details below.</p>
                <div className="min-h-[400px]">
                    {activeStep === 0 && <BasicsForm data={data} onChange={handleChange} />}
                    {activeStep === 1 && <SummaryForm data={data} onChange={handleChange} />}
                    {activeStep === 2 && <ExperienceForm data={data} onChange={handleChange} />}
                    {activeStep === 3 && <EducationForm data={data} onChange={handleChange} />}
                    {activeStep === 4 && <ProjectsForm data={data} onChange={handleChange} />}
                    {activeStep === 5 && <ListForm items={data.skills} onChange={v => handleChange({...data, skills: v})} placeholder="e.g. React.js" />}
                    {activeStep === 6 && <ListForm items={data.languages} onChange={v => handleChange({...data, languages: v})} placeholder="e.g. English (Native)" />}
                    {activeStep === 7 && <ListForm items={data.certifications} onChange={v => handleChange({...data, certifications: v})} placeholder="e.g. Google UX Cert" />}
                    {activeStep === 8 && <TemplateForm data={data} onChange={handleChange} />}
                </div>
                <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                    <Button variant="secondary" onClick={prevStep} disabled={activeStep === 0}>Back</Button>
                    {activeStep === STEPS.length - 1 ? <Button onClick={onPreview}>Final Preview →</Button> : <Button onClick={nextStep}>Next Step →</Button>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};