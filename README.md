# Pilot Nápadů

Moderní webová aplikace pro generování a správu podnikatelských nápadů s pomocí Google Gemini AI.

## 🚀 Funkce

- **AI-generované nápady**: Využívá Google Gemini API pro vytváření personalizovaných podnikatelských nápadů
- **Různé business modely**: Nabízí 6 přednastavených business modelů (AI experiences, Micro-SaaS, Digital bundles, atd.)
- **Personalizovaný dotazník**: Přizpůsobuje nápady podle vašich preferencí a dovedností
- **Správa projektů**: Ukládání a organizace vašich nápadů
- **Generování dokumentů**: Automatické vytváření marketingových plánů, analýz rizik, SWOT analýz
- **Export funkcionalita**: Stahování dokumentů a kompletních projektových balíčků

## 🛠 Technologie

- **Frontend**: React 18, Lucide React (ikony)
- **Backend**: Firebase (Firestore, Authentication)
- **AI**: Google Gemini API
- **Build tool**: Vite
- **Styling**: CSS-in-JS s custom CSS proměnnými

## 📦 Instalace

1. Naklonujte repository:
```bash
git clone https://github.com/YOUR_USERNAME/pilot-napadu.git
cd pilot-napadu
```

2. Nainstalujte závislosti:
```bash
npm install
```

3. Vytvořte `.env` soubor v root adresáři a přidejte vaše API klíče:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Spusťte vývojový server:
```bash
npm run dev
```

## 🔧 Konfigurace

### Firebase Setup
1. Vytvořte nový projekt na [Firebase Console](https://console.firebase.google.com/)
2. Povolte Firestore Database a Authentication
3. Zkopírujte konfigurační údaje do `.env` souboru

### Google Gemini API
1. Získejte API klíč z [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Přidejte klíč do `.env` souboru jako `VITE_GEMINI_API_KEY`

## 📂 Struktura projektu

```
pilot-napadu/
├── src/
│   ├── App.jsx          # Hlavní komponenta aplikace
│   └── main.jsx         # Entry point
├── public/
│   ├── index.html       # HTML template
│   └── vite.svg         # Vite logo
├── .env                 # Environment proměnné (neverzováno)
├── package.json         # NPM závislosti a skripty
├── vite.config.js       # Vite konfigurace
└── README.md           # Dokumentace
```

## 🚀 Nasazení

### Vercel (doporučeno)
1. Připojte GitHub repository k Vercel
2. Přidejte environment proměnné v Vercel dashboard
3. Deploy bude automatický při každém push

### Netlify
1. Připojte GitHub repository k Netlify
2. Nastavte build command: `npm run build`
3. Nastavte publish directory: `dist`
4. Přidejte environment proměnné

## 🤝 Přispívání

1. Fork repository
2. Vytvořte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit změny (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otevřete Pull Request

## 📝 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor pro detaily.

## 🆘 Podpora

Pokud narazíte na problém nebo máte otázku:
1. Zkontrolujte [Issues](https://github.com/YOUR_USERNAME/pilot-napadu/issues)
2. Vytvořte nový Issue s detailním popisem problému
3. Použijte příslušné labels

## 🔮 Roadmap

- [ ] Přidání více business modelů
- [ ] Integrace s více AI modely
- [ ] Mobilní aplikace
- [ ] Týmová spolupráce
- [ ] Advanced analytics
- [ ] Template marketplace

---

Vytvořeno s ❤️ pro české podnikatele
