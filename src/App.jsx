import React, { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Home, Lightbulb, Briefcase, FileText, ChevronLeft, Swords, Target, Settings, Building, User, DollarSign, Heart, PiggyBank, Shield, TrendingUp, Download, Copy, Mail, CheckCircle } from 'lucide-react';

// --- FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// --- STYLING ---
const styles = `
    :root { --background: 240 10% 3.9%; --foreground: 0 0% 98%; --card: 240 10% 3.9%; --card-foreground: 0 0% 98%; --popover: 240 10% 3.9%; --popover-foreground: 0 0% 98%; --primary: 0 0% 98%; --primary-foreground: 240 5.9% 10%; --secondary: 240 3.7% 15.9%; --secondary-foreground: 0 0% 98%; --muted: 240 3.7% 15.9%; --muted-foreground: 240 5% 64.9%; --accent: 240 3.7% 15.9%; --accent-foreground: 0 0% 98%; --destructive: 0 62.8% 30.6%; --destructive-foreground: 0 0% 98%; --border: 240 3.7% 15.9%; --input: 240 3.7% 15.9%; --ring: 240 4.9% 83.9%; }
    .dark { --background: 240 10% 3.9%; --foreground: 0 0% 98%; --card: 240 10% 3.9%; --card-foreground: 0 0% 98%; --popover: 240 10% 3.9%; --popover-foreground: 0 0% 98%; --primary: 0 0% 98%; --primary-foreground: 240 5.9% 10%; --secondary: 240 3.7% 15.9%; --secondary-foreground: 0 0% 98%; --muted: 240 3.7% 15.9%; --muted-foreground: 240 5% 64.9%; --accent: 240 3.7% 15.9%; --accent-foreground: 0 0% 98%; --destructive: 0 62.8% 30.6%; --destructive-foreground: 0 0% 98%; --border: 240 3.7% 15.9%; --input: 240 3.7% 15.9%; --ring: 240 4.9% 83.9%; }
    body { font-family: 'Inter', sans-serif; background-color: #09090b; color: #f8f9fa; }
    .gemini-button { background-color: #2563eb; color: white; transition: background-color 0.2s, transform 0.2s; }
    .gemini-button:hover { background-color: #1d4ed8; }
    .gemini-button:disabled { background-color: #1e40af; cursor: not-allowed; }
    .secondary-button { background-color: #3f3f46; color: #f8f9fa; }
    .secondary-button:hover { background-color: #52525b; }
    .loader { border: 4px solid #3f3f46; border-top: 4px solid #2563eb; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .survey-option { border: 2px solid #3f3f46; transition: all 0.2s; }
    .survey-option:hover { border-color: #2563eb; background-color: #1c1c1f; }
    .survey-option.selected { border-color: #2563eb; background-color: #1e40af; color: white; }
    .progress-bar-bg { background-color: #3f3f46; }
    .progress-bar-fill { background-color: #2563eb; transition: width 0.3s ease-in-out; }
    .text-input { background-color: #1c1c1f; border: 2px solid #3f3f46; color: white; }
    .text-input:focus { border-color: #2563eb; outline: none; }
    .toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; z-index: 100; transition: opacity 0.3s, transform 0.3s; }
    .toast.hide { opacity: 0; transform: translate(-50%, 20px); }
`;

// --- DATA & TEXT STRINGS ---
const textStrings = {
    gemini_marketing_prompt: \`Vytvořte profesionální marketingovou strategii pro firmu založenou na tomto konceptu: 'concept'. Zahrňte následující sekce s jasnými nadpisy a pro každou sekci uveďte 3-4 odrážky:**Cílová skupina:**Detailní popis ideálního zákazníka, jeho demografie, potřeby a chování.]**Unikátní prodejní nabídka (USP):**Jasně definujte, co produkt odlišuje od konkurence. Buďte konkrétní.]**Marketingové kanály:**Navrhněte 3 specifické kanály s vysvětlením, proč jsou vhodné pro danou cílovou skupinu.]**Klíčové metriky úspěchu (KPIs):**Uveďte 3-4 měřitelné ukazatele pro sledování úspěšnosti marketingu.]\`,
    gemini_risks_prompt: \`Pro firmu založenou na konceptu 'concept' analyzujte potenciální rizika a navrhněte strategie pro jejich zmírnění. Strukturujte svou odpověď s následujícími nadpisy:**1. Tržní a konkurenční riziko:**Popište hlavní výzvy a navrhněte 2 strategie zmírnění.]**2. Technické a provozní riziko:**Popište potenciální překážky a navrhněte 2 strategie zmírnění.]**3. Finanční a monetizační riziko:**Popište finanční výzvy a navrhněte 2 strategie zmírnění.]\`,
    gemini_ideas_prompt: \`Na základě následujícího obchodního konceptu vygenerujte tři konkrétní a specializované nápady na startup. Uživatel specifikoval následující preference: Hlavní motivace: motivation, Počáteční rozpočet: budget, Cílový rozsah projektu: scale, Přístup k riziku: riskTolerance, Cílová skupina: audience, Preferovaná monetizace: monetization, Technické dovednosti: skills, Preferovaný obor: industry. Prosím, přizpůsobte nápady těmto detailním specifikacím. Výstup prezentujte jako číslovaný seznam.Koncept: "concept"\`,
    gemini_monetization_prompt: \`Pro podnikání založené na konceptu 'concept' vytvořte potenciální strategii monetizace. Struktura vaší odpovědi by měla mít následující nadpisy:**1. Možné zdroje příjmů:** Zdroj A: [Popis] Zdroj B: [Popis] Zdroj C: [Popis]**2. Doporučený cenový model:**Popište primární cenový model, např. freemium, předplatné, jednorázový nákup]**3. Klíčové náklady k zvážení:**Uveďte hlavní provozní náklady, které je třeba zvážit]\`,
    gemini_pitch_prompt: \`Pro podnikání založené na konceptu 'concept' vytvořte stručnou "elevator pitch". Struktura vaší odpovědi by měla mít následující nadpisy a každá sekce by měla mít 1-2 věty:**Problém:**Jaký problém to řeší?]**Řešení:**Jak tento podnik problém řeší?]**Cílový trh:**Kdo jsou hlavní zákazníci?]**Unikátní prodejní argument (USP):**Čím se liší od konkurence?]\`,
    gemini_idea_details_prompt: \`Pro následující podnikatelský nápad 'idea' vytvořte detailní rozpis. Zahrňte následující sekce s krátkými popisy a odrážkami:**Cílová Skupina:**Stručný popis, kdo je ideální zákazník.]**Unikátní Prodejní Nabídka (USP):**V čem je nápad jedinečný a lepší než konkurence?]**Možná Monetizace:**Jak by mohl projekt vydělávat peníze? Uveďte 2-3 příklady.]**První Kroky:**Jaké jsou 3 nejdůležitější první kroky k realizaci?]\`,
    gemini_swot_prompt: \`Pro podnikatelský nápad 'concept' vytvořte podrobnou SWOT analýzu. Pro každou sekci uveďte 3-4 konkrétních bodů formou odrážek.**Silné stránky (Strengths):**Vnitřní faktory, které dávají projektu výhodu.]**Slabé stránky (Weaknesses):**Vnitřní faktory, které projekt znevýhodňují.]**Příležitosti (Opportunities):**Vnější faktory, které by mohl projekt využít ve svůj prospěch.]**Hrozby (Threats):**Vnější faktory, které by mohly projektu uškodit.]\`,
    gemini_competitor_prompt: \`Pro podnikatelský nápad 'concept', identifikujte 3 hlavní potenciální konkurenty (mohou to být konkrétní firmy nebo typy služeb). Pro každého konkurenta stručně analyzujte:**Konkurent 1: [Jméno/Typ]** **Hlavní produkt/služba:** **Předpokládané silné stránky:****Konkurent 2: [Jméno/Typ]** **Hlavní produkt/služba:** **Předpokládané silné stránky:****Konkurent 3: [Jméno/Typ]** **Hlavní produkt/služba:** **Předpokládané silné stránky:**\`,
};

// Static data for the business models
const businessData = {
    'ai-experiences': { 
        metrics: { automation: 9, scalability: 10, effort: 8 }, 
        icon: '🤖', 
        title: 'Generátory zážitků s AI', 
        description: 'Platformy, které uživatelům generují unikátní, personalizované digitální zážitky.',
        content: { 
            concept: { 
                body: "Překonejte hranice jednoduchých nástrojů. Vytvářejte platformy, které generují unikátní, personalizované digitální zážitky, od interaktivních cestovních plánů po meditace na míru, vše přizpůsobené zadání uživatele." 
            } 
        }
    },
    'micro-saas': { 
        metrics: { automation: 9, scalability: 10, effort: 9 }, 
        icon: '⚡', 
        title: 'Automatizované Micro-SaaS platformy', 
        description: 'Vytvořte a prodávejte malé, zaměřené softwarové řešení, které řeší jeden specifický problém.',
        content: { 
            concept: { 
                body: "Vyvíjejte jednoduchý nástroj typu Software-as-a-Service (SaaS), který poskytuje jeden cenný krok pro úzce vymezené publikum. Cílem není budovat obrovskou platformu, ale 'mikro' nástroj, který je snadný udržovat. Příjmy plynou z opakovaného měsíčního nebo ročního předplatného." 
            } 
        }
    },
    'digital-bundles': { 
        metrics: { automation: 8, scalability: 10, effort: 7 }, 
        icon: '📦', 
        title: 'Kurátorované balíčky digitálních produktů', 
        description: 'Drop-shipping pro digitální zboží. Prodávejte tematické balíčky produktů od nezávislých tvůrců.',
        content: { 
            concept: { 
                body: "Nevytvářejte produkty sami. Místo toho najděte nezávislé tvůrce digitálního zboží (e-knihy, šablony, presety, software), dohodněte si provizi a prodávejte jejich produkty společně v tematickém balíčku na svém webu." 
            } 
        }
    },
    'programmatic-seo': { 
        metrics: { automation: 10, scalability: 9, effort: 8 }, 
        icon: '🔍', 
        title: 'Programatické SEO affiliate weby', 
        description: 'Vytvořte specializovaný web, kde je obsah generován programaticky, aby cílil na long-tail klíčová slova.',
        content: { 
            concept: { 
                body: "Vytvořte specializovaný blog nebo recenzní web, kde je obsah generován programaticky. To znamená použití skriptů k kombinaci šablony s velkým souborem dat k vytvoření stovek nebo tisíců jedinečných stránek cílících na velmi specifické, long-tail klíčová slova." 
            } 
        }
    },
    'interactive-courses': { 
        metrics: { automation: 7, scalability: 10, effort: 5 }, 
        icon: '📚', 
        title: 'Interaktivní digitální příběhy a kurzy', 
        description: 'Prodávejte poutavé kurzy nebo příběhy ve stylu "vyber si své vlastní dobrodružství" s větvícími příběhy.',
        content: { 
            concept: { 
                body: "Vytvářejte a prodávejte krátké, poutavé, textové kurzy nebo fiktivní příběhy, kde uživatel činí rozhodnutí, která ovlivňují výsledek. Je to poutavější než jednoduchá e-kniha a může být ceněno výše." 
            } 
        }
    },
    'personalized-shops': { 
        metrics: { automation: 9, scalability: 8, effort: 7 }, 
        icon: '🎨', 
        title: 'Automatizované obchody s personalizovanými produkty', 
        description: 'Vytvořte e-shopy, které prodávají produkty na zakázku personalizované zákazníkem.',
        content: { 
            concept: { 
                body: "Založte online obchod propojený se službou tisku na vydání (print-on-demand, POD). Zákazníci si personalizují produkty (hrnky, trička, plakáty, pohádkové knihy) vlastním textem, fotografiemi nebo uměním generovaným AI. Objednávka se automaticky odešle poskytovateli POD, který ji vytiskne, zabalí a odešle přímo zákazníkovi. Vy se staráte o e-shop a marketing." 
            } 
        }
    },
};

// Firebase instances
let db, auth;

// --- API & UTILITY FUNCTIONS ---
const callGeminiAPI = async (userQuery) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        console.error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file');
        return null;
    }

    const apiUrl = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=\${apiKey}\`;
    const payload = { contents: [{ parts: [{ text: userQuery }] }] };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(\`API request failed with status \${response.status}\`);

        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        return null;
    }
};

const parseGeneratedContent = (text) => {
    if (!text) return [];
    let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlText = htmlText.replace(/(^|\n)- /g, '$1<li>');
    htmlText = htmlText.replace(/(^|\n)• /g, '$1<li>');
    htmlText = \`<ul>\${htmlText}</ul>\`.replace(/<\/li><li>/g, '</li><li>').replace(/<ul><li>/g,'<ul>').replace(/<\/li><\/ul>/g,'</ul>');

    const sections = htmlText.split('\n\n').filter(s => s.trim() !== '');
    return sections.map(section => {
        const lines = section.split('\n');
        const titleMatch = lines[0].match(/<strong>(.*?)<\/strong>|(.*?):/);
        const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : lines[0];
        const content = titleMatch ? lines.slice(1).join('\n') : lines.slice(1).join('\n');
        return { title, content: content.trim() };
    });
};

const plainTextFromGeneratedContent = (text) => {
    if (!text) return '';
    return text.replace(/\*\*/g, '');
};

// REACT COMPONENTS WOULD CONTINUE HERE...
// Pro stručnost ukázky, zde by pokračovaly všechny React komponenty
// (Toast, Header, ModelSelector, ProjectDashboard, atd.)

export default function App() {
    // State management
    const [userId, setUserId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [view, setView] = useState('models');
    const [selectedProject, setSelectedProject] = useState(null);
    const [generatedIdeas, setGeneratedIdeas] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Firebase initialization
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    await signInAnonymously(auth);
                }
            });
        } catch (e) {
            console.error("Firebase init failed:", e);
        }
    }, []);

    // Project listener
    useEffect(() => {
        if (!userId || !db) return;

        const q = collection(db, \`users/\${userId}/projects\`);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(fetchedProjects.sort((a,b) => b.createdAt.toDate() - a.createdAt.toDate()));
        });

        return () => unsubscribe();
    }, [userId]);

    // Render
    return (
        <>
            <style>{styles}</style>
            <div className="bg-[#09090b] min-h-screen flex flex-col">
                <header className="px-8 py-4 bg-[#111113] border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-white">Pilot Nápadů</h1>
                </header>
                <main className="flex-1 p-8">
                    <div className="text-center py-16">
                        <h2 className="text-3xl font-bold text-white mb-6">🚀 Vítejte v Pilot Nápadů</h2>
                        <p className="text-gray-400 mb-8">AI-powered generátor podnikatelských nápadů</p>
                        <div className="text-sm text-gray-500">
                            Nahrajte API klíče do .env souboru pro plnou funkcionalitu
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}