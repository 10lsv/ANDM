const pptxgen = require("C:\\nvm4w\\nodejs\\node_modules\\pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NutriScan SUPINFO";
pres.title = "NutriScan - Application Mobile de Scan Alimentaire";

// Color palette - Fresh green / dark theme
const C = {
  darkBg: "0F172A",
  darkSurface: "1E293B",
  green: "10B981",
  greenLight: "34D399",
  greenDark: "059669",
  greenBg: "064E3B",
  white: "FFFFFF",
  offWhite: "F1F5F9",
  gray: "94A3B8",
  grayDark: "64748B",
  text: "1E293B",
  accent: "6366F1",
  orange: "F59E0B",
  red: "EF4444",
  nutriA: "038141",
  nutriB: "85BB2F",
  nutriC: "FECB02",
  nutriD: "EE8100",
  nutriE: "E63E11",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.12 });

// ============================================================
// SLIDE 1 - Title Slide (dark bg)
// ============================================================
let s1 = pres.addSlide();
s1.background = { color: C.darkBg };

// Green accent shape top-right
s1.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 4, h: 4, fill: { color: C.green, transparency: 15 } });
s1.addShape(pres.shapes.OVAL, { x: 8.5, y: -0.8, w: 2.5, h: 2.5, fill: { color: C.greenLight, transparency: 20 } });

// Green accent shape bottom-left
s1.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 4, h: 4, fill: { color: C.green, transparency: 10 } });

// Small green bar accent
s1.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.8, w: 0.6, h: 0.06, fill: { color: C.green } });

s1.addText("NutriScan", {
  x: 0.8, y: 2.0, w: 6, h: 1.2,
  fontSize: 54, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
});

s1.addText("Application mobile de scan alimentaire", {
  x: 0.8, y: 3.0, w: 6, h: 0.5,
  fontSize: 20, fontFace: "Calibri", color: C.greenLight, margin: 0,
});

s1.addText("Scannez. Comprenez. Mangez mieux.", {
  x: 0.8, y: 3.5, w: 6, h: 0.5,
  fontSize: 16, fontFace: "Calibri", color: C.gray, italic: true, margin: 0,
});

s1.addText("SUPINFO - Module React Native - Bac+3", {
  x: 0.8, y: 4.6, w: 6, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: C.grayDark, margin: 0,
});

// ============================================================
// SLIDE 2 - Sommaire
// ============================================================
let s2 = pres.addSlide();
s2.background = { color: C.offWhite };

s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

s2.addText("Sommaire", {
  x: 0.8, y: 0.4, w: 8, h: 0.7,
  fontSize: 36, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
});

const sommaire = [
  { num: "01", title: "Présentation du projet" },
  { num: "02", title: "Technologies & API" },
  { num: "03", title: "Fonctionnalités obligatoires" },
  { num: "04", title: "Fonctionnalités différenciantes" },
  { num: "05", title: "Architecture technique" },
  { num: "06", title: "Design & UX" },
  { num: "07", title: "Démo & Conclusion" },
];

sommaire.forEach((item, i) => {
  const y = 1.35 + i * 0.55;
  // Number circle
  s2.addShape(pres.shapes.OVAL, { x: 0.8, y: y, w: 0.4, h: 0.4, fill: { color: i === 0 ? C.green : C.darkBg } });
  s2.addText(item.num, {
    x: 0.8, y: y, w: 0.4, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0,
  });
  s2.addText(item.title, {
    x: 1.4, y: y, w: 6, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0,
  });
  // Dotted line
  s2.addShape(pres.shapes.LINE, { x: 1.4, y: y + 0.48, w: 7, h: 0, line: { color: "E2E8F0", width: 1 } });
});

// ============================================================
// SLIDE 3 - Présentation du projet
// ============================================================
let s3 = pres.addSlide();
s3.background = { color: C.offWhite };
s3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

s3.addText("Présentation du projet", {
  x: 0.8, y: 0.3, w: 8, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
});

// Left description
s3.addText("NutriScan est une application mobile de scan alimentaire inspirée de Yuka. L'utilisateur peut photographier le code-barres d'un produit pour obtenir ses informations nutritionnelles, son Nutri-Score et des alertes personnalisées.", {
  x: 0.8, y: 1.2, w: 5.2, h: 1.3,
  fontSize: 14, fontFace: "Calibri", color: C.grayDark, lineSpacingMultiple: 1.3, margin: 0,
});

// Key info cards
const keyInfo = [
  { label: "Framework", value: "React Native / Expo SDK 54", color: C.green },
  { label: "API", value: "Open Food Facts (gratuite)", color: C.accent },
  { label: "Durée", value: "2 semaines", color: C.orange },
  { label: "Organisation", value: "Projet en binôme", color: C.red },
];

keyInfo.forEach((info, i) => {
  const y = 2.8 + i * 0.65;
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 5.2, h: 0.55, fill: { color: C.white }, shadow: makeShadow() });
  s3.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.06, h: 0.55, fill: { color: info.color } });
  s3.addText(info.label, { x: 1.1, y: y, w: 1.8, h: 0.55, fontSize: 12, fontFace: "Calibri", color: C.grayDark, bold: true, valign: "middle", margin: 0 });
  s3.addText(info.value, { x: 2.9, y: y, w: 3, h: 0.55, fontSize: 13, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0 });
});

// Right side - objectives
s3.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 1.2, w: 3.2, h: 4, fill: { color: C.darkBg }, shadow: makeShadow() });
s3.addText("Objectifs", { x: 6.8, y: 1.4, w: 2.6, h: 0.4, fontSize: 16, fontFace: "Calibri", color: C.greenLight, bold: true, margin: 0 });

const objectives = [
  "App mobile complète",
  "API REST publique",
  "Caméra & code-barres",
  "Navigation multi-écrans",
  "Persistance locale",
  "Thème clair / sombre",
  "Versioning Git",
];

s3.addText(
  objectives.map((o, i) => ({
    text: o,
    options: { bullet: true, color: C.offWhite, fontSize: 12, breakLine: i < objectives.length - 1 },
  })),
  { x: 6.8, y: 1.9, w: 2.8, h: 3, fontFace: "Calibri", paraSpaceAfter: 6, margin: 0 }
);

// ============================================================
// SLIDE 4 - Technologies & API
// ============================================================
let s4 = pres.addSlide();
s4.background = { color: C.darkBg };

s4.addText("Technologies & API", {
  x: 0.8, y: 0.4, w: 8, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
});

// Tech stack cards
const techCards = [
  { title: "React Native", desc: "Framework mobile cross-platform", color: C.green },
  { title: "Expo SDK 54", desc: "Toolchain et gestion native", color: C.greenLight },
  { title: "React Navigation", desc: "Tab + Stack Navigator", color: C.accent },
  { title: "AsyncStorage", desc: "Persistance locale des données", color: C.orange },
  { title: "Expo Camera", desc: "Scan de codes-barres", color: C.greenDark },
  { title: "TypeScript", desc: "Typage statique & qualité", color: "3B82F6" },
];

techCards.forEach((card, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.8 + col * 2.9;
  const y = 1.4 + row * 1.6;

  s4.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.6, h: 1.3, fill: { color: C.darkSurface }, shadow: makeShadow() });
  s4.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.6, h: 0.06, fill: { color: card.color } });
  s4.addText(card.title, { x: x + 0.2, y: y + 0.2, w: 2.2, h: 0.4, fontSize: 15, fontFace: "Calibri", color: C.white, bold: true, margin: 0 });
  s4.addText(card.desc, { x: x + 0.2, y: y + 0.6, w: 2.2, h: 0.5, fontSize: 11, fontFace: "Calibri", color: C.gray, margin: 0 });
});

// API section
s4.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.06, fill: { color: C.green, transparency: 50 } });
s4.addText("API Open Food Facts", { x: 0.8, y: 4.75, w: 4, h: 0.35, fontSize: 14, fontFace: "Calibri", color: C.greenLight, bold: true, margin: 0 });
s4.addText("Base de données alimentaire open source  |  3M+ produits  |  Sans inscription  |  User-Agent requis", {
  x: 0.8, y: 5.05, w: 8.4, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.gray, margin: 0,
});

// ============================================================
// SLIDE 5 - Fonctionnalités obligatoires
// ============================================================
let s5 = pres.addSlide();
s5.background = { color: C.offWhite };
s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

s5.addText("Fonctionnalités obligatoires", {
  x: 0.8, y: 0.3, w: 9, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
});

const features = [
  { title: "Scanner de code-barres", desc: "Caméra arrière, détection auto EAN-13/UPC, requête API instantanée, gestion d'erreur", icon: "SCAN" },
  { title: "Fiche produit complète", desc: "Photo, Nutri-Score visuel, NOVA, tableau nutritionnel, ingrédients, allergènes", icon: "INFO" },
  { title: "Historique des scans", desc: "Sauvegarde locale, ordre chronologique, suppression, persistance entre sessions", icon: "TIME" },
  { title: "Recherche de produits", desc: "Recherche par nom/marque via OpenFoodFacts, debounce 400ms, pagination", icon: "FIND" },
  { title: "Mode sombre", desc: "Toggle dans les paramètres, appliqué sur tous les écrans, choix persisté", icon: "MOON" },
  { title: "Navigation complète", desc: "Tab Navigator (5 onglets) + Stack Navigator, transitions fluides", icon: "NAV" },
];

features.forEach((feat, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.8 + col * 4.4;
  const y = 1.2 + row * 1.4;

  s5.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.0, h: 1.15, fill: { color: C.white }, shadow: makeShadow() });
  s5.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.2, w: 0.55, h: 0.55, fill: { color: C.green, transparency: 85 } });
  s5.addText(feat.icon.charAt(0), { x: x + 0.15, y: y + 0.2, w: 0.55, h: 0.55, fontSize: 16, fontFace: "Arial Black", color: C.green, align: "center", valign: "middle", margin: 0 });
  s5.addText(feat.title, { x: x + 0.85, y: y + 0.12, w: 3.0, h: 0.35, fontSize: 13, fontFace: "Calibri", color: C.text, bold: true, margin: 0, valign: "middle" });
  s5.addText(feat.desc, { x: x + 0.85, y: y + 0.5, w: 3.0, h: 0.55, fontSize: 10, fontFace: "Calibri", color: C.grayDark, margin: 0 });
});

// ============================================================
// SLIDE 6 - Fonctionnalités différenciantes
// ============================================================
let s6 = pres.addSlide();
s6.background = { color: C.darkBg };

s6.addText("Fonctionnalités différenciantes", {
  x: 0.8, y: 0.4, w: 9, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
});

s6.addText("Ce qui distingue NutriScan d'un simple clone", {
  x: 0.8, y: 1.0, w: 6, h: 0.35,
  fontSize: 14, fontFace: "Calibri", color: C.gray, italic: true, margin: 0,
});

const diffFeatures = [
  { title: "Comparateur de produits", desc: "Sélection de 2 produits, comparaison côte à côte avec barres visuelles, code couleur vert/rouge par critère, résumé du gagnant", color: C.green },
  { title: "Profil allergènes", desc: "14 allergènes configurables (gluten, lait, œufs...), alertes visuelles sur la fiche produit, régimes alimentaires", color: C.orange },
  { title: "Dashboard nutritionnel", desc: "Score personnel basé sur l'historique, suivi des calories du jour, barre de progression, objectif personnalisable", color: C.accent },
  { title: "Favoris par catégories", desc: "Catégories par défaut et personnalisées, ajout/suppression, persistance locale via AsyncStorage", color: C.greenLight },
];

diffFeatures.forEach((feat, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.8 + col * 4.4;
  const y = 1.6 + row * 1.8;

  s6.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.0, h: 1.5, fill: { color: C.darkSurface }, shadow: makeShadow() });
  s6.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.0, h: 0.06, fill: { color: feat.color } });
  s6.addText(feat.title, { x: x + 0.25, y: y + 0.2, w: 3.5, h: 0.35, fontSize: 15, fontFace: "Calibri", color: C.white, bold: true, margin: 0 });
  s6.addText(feat.desc, { x: x + 0.25, y: y + 0.6, w: 3.5, h: 0.8, fontSize: 11, fontFace: "Calibri", color: C.gray, lineSpacingMultiple: 1.3, margin: 0 });
});

// ============================================================
// SLIDE 7 - Architecture technique
// ============================================================
let s7 = pres.addSlide();
s7.background = { color: C.offWhite };
s7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

s7.addText("Architecture technique", {
  x: 0.8, y: 0.3, w: 8, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
});

// Left side - folder structure
s7.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 4.2, h: 4.0, fill: { color: C.darkBg }, shadow: makeShadow() });
s7.addText("Structure du projet", { x: 1.1, y: 1.35, w: 3.6, h: 0.35, fontSize: 14, fontFace: "Calibri", color: C.greenLight, bold: true, margin: 0 });

const folderLines = [
  "src/",
  "  components/     Composants UI",
  "  screens/        Écrans de l'app",
  "  navigation/     Config navigation",
  "  utils/          API & helpers",
  "  context/        React Context",
  "  hooks/          Hooks custom",
  "  types/          Types TypeScript",
  "assets/           Images & icônes",
  "App.tsx           Point d'entrée",
];

s7.addText(
  folderLines.map((line, i) => ({
    text: line,
    options: { fontSize: 11, fontFace: "Consolas", color: i === 0 || i === 8 || i === 9 ? C.greenLight : C.gray, breakLine: i < folderLines.length - 1 },
  })),
  { x: 1.1, y: 1.8, w: 3.8, h: 3.2, margin: 0, paraSpaceAfter: 3 }
);

// Right side - patterns
s7.addText("Patterns utilisés", { x: 5.5, y: 1.2, w: 4, h: 0.4, fontSize: 16, fontFace: "Calibri", color: C.text, bold: true, margin: 0 });

const patterns = [
  { title: "React Context", desc: "Gestion d'état globale (thème, historique, favoris, profil)" },
  { title: "AsyncStorage", desc: "Persistance locale de toutes les données utilisateur" },
  { title: "Custom Hooks", desc: "useTheme pour accéder au thème depuis n'importe quel composant" },
  { title: "Debounce + Cache", desc: "Recherche optimisée avec cache mémoire et AbortController" },
  { title: "Animated API", desc: "Animations natives (fade-in, slide, scan line, progress bar)" },
];

patterns.forEach((p, i) => {
  const y = 1.8 + i * 0.72;
  s7.addShape(pres.shapes.RECTANGLE, { x: 5.5, y, w: 4.0, h: 0.6, fill: { color: C.white }, shadow: makeShadow() });
  s7.addShape(pres.shapes.RECTANGLE, { x: 5.5, y, w: 0.06, h: 0.6, fill: { color: C.green } });
  s7.addText(p.title, { x: 5.8, y, w: 3.5, h: 0.28, fontSize: 12, fontFace: "Calibri", color: C.text, bold: true, margin: 0, valign: "bottom" });
  s7.addText(p.desc, { x: 5.8, y: y + 0.28, w: 3.5, h: 0.28, fontSize: 10, fontFace: "Calibri", color: C.grayDark, margin: 0, valign: "top" });
});

// ============================================================
// SLIDE 8 - Écrans de l'application
// ============================================================
let s8 = pres.addSlide();
s8.background = { color: C.offWhite };
s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

s8.addText("Écrans de l'application", {
  x: 0.8, y: 0.3, w: 8, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
});

const screens = [
  { name: "Accueil", desc: "Quick actions, scans récents, tips", color: C.green },
  { name: "Scanner", desc: "Caméra plein écran, overlay visuel, flash", color: C.greenDark },
  { name: "Recherche", desc: "Recherche auto avec debounce, résultats", color: C.accent },
  { name: "Détail produit", desc: "Nutri-Score, NOVA, Eco-Score, nutriments", color: "3B82F6" },
  { name: "Historique", desc: "Scans récents, suppression, navigation", color: C.orange },
  { name: "Favoris", desc: "Catégories, ajout/suppression, filtres", color: C.red },
  { name: "Comparateur", desc: "2 produits côte à côte, barres visuelles", color: "8B5CF6" },
  { name: "Profil", desc: "Dark mode, allergènes, dashboard, à propos", color: "EC4899" },
];

screens.forEach((screen, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 0.5 + col * 2.35;
  const y = 1.2 + row * 2.2;

  // Phone mockup shape
  s8.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.1, h: 1.9, fill: { color: C.white }, shadow: makeShadow() });
  // Color accent bar at top
  s8.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.1, h: 0.35, fill: { color: screen.color } });
  // Screen name
  s8.addText(screen.name, { x, y, w: 2.1, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  // Description
  s8.addText(screen.desc, { x: x + 0.15, y: y + 0.5, w: 1.8, h: 1.2, fontSize: 10, fontFace: "Calibri", color: C.grayDark, align: "center", valign: "top", margin: 0 });
});

// ============================================================
// SLIDE 9 - Nutri-Score & Scores
// ============================================================
let s9 = pres.addSlide();
s9.background = { color: C.darkBg };

s9.addText("Système de scores", {
  x: 0.8, y: 0.4, w: 8, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
});

// Nutri-Score row
s9.addText("Nutri-Score", { x: 0.8, y: 1.3, w: 3, h: 0.35, fontSize: 16, fontFace: "Calibri", color: C.greenLight, bold: true, margin: 0 });
s9.addText("Score nutritionnel de A (excellent) à E (mauvais)", { x: 0.8, y: 1.6, w: 5, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.gray, margin: 0 });

const nutriScores = [
  { letter: "A", color: C.nutriA },
  { letter: "B", color: C.nutriB },
  { letter: "C", color: C.nutriC },
  { letter: "D", color: C.nutriD },
  { letter: "E", color: C.nutriE },
];

nutriScores.forEach((ns, i) => {
  const x = 0.8 + i * 1.2;
  s9.addShape(pres.shapes.RECTANGLE, { x, y: 2.0, w: 1.0, h: 0.7, fill: { color: ns.color } });
  s9.addText(ns.letter, { x, y: 2.0, w: 1.0, h: 0.7, fontSize: 28, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle", margin: 0 });
});

// NOVA groups
s9.addText("Groupe NOVA", { x: 0.8, y: 3.0, w: 3, h: 0.35, fontSize: 16, fontFace: "Calibri", color: C.greenLight, bold: true, margin: 0 });

const novaGroups = [
  { num: "1", label: "Non transformé", color: C.nutriA },
  { num: "2", label: "Ingrédients culinaires", color: C.nutriB },
  { num: "3", label: "Transformé", color: C.nutriD },
  { num: "4", label: "Ultra-transformé", color: C.nutriE },
];

novaGroups.forEach((n, i) => {
  const x = 0.8 + i * 2.2;
  s9.addShape(pres.shapes.OVAL, { x, y: 3.5, w: 0.5, h: 0.5, fill: { color: n.color } });
  s9.addText(n.num, { x, y: 3.5, w: 0.5, h: 0.5, fontSize: 18, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle", margin: 0 });
  s9.addText(n.label, { x: x + 0.6, y: 3.5, w: 1.5, h: 0.5, fontSize: 11, fontFace: "Calibri", color: C.offWhite, valign: "middle", margin: 0 });
});

// Eco-Score
s9.addText("Eco-Score", { x: 0.8, y: 4.3, w: 3, h: 0.35, fontSize: 16, fontFace: "Calibri", color: C.greenLight, bold: true, margin: 0 });
s9.addText("Impact environnemental du produit (A à E)", { x: 0.8, y: 4.6, w: 5, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.gray, margin: 0 });

nutriScores.forEach((ns, i) => {
  const x = 0.8 + i * 1.2;
  s9.addShape(pres.shapes.OVAL, { x: x + 0.15, y: 5.0, w: 0.45, h: 0.45, fill: { color: ns.color } });
  s9.addText(ns.letter, { x: x + 0.15, y: 5.0, w: 0.45, h: 0.45, fontSize: 16, fontFace: "Arial Black", color: C.white, align: "center", valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 10 - Bonus & Points forts
// ============================================================
let s10 = pres.addSlide();
s10.background = { color: C.offWhite };
s10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

s10.addText("Bonus & Points forts", {
  x: 0.8, y: 0.3, w: 8, h: 0.7,
  fontSize: 32, fontFace: "Arial Black", color: C.text, bold: true, margin: 0,
});

const bonuses = [
  { title: "Animations fluides", desc: "Animated API native : fade-in des cartes, scan line animée, transitions d'écrans", color: C.green },
  { title: "Retour haptique", desc: "Vibration au scan réussi et aux alertes allergènes via expo-haptics", color: C.accent },
  { title: "Partage de produit", desc: "Bouton Share natif pour envoyer les infos d'un produit via SMS, WhatsApp...", color: C.orange },
  { title: "Cache & Performance", desc: "Cache mémoire 5min, AbortController, debounce 400ms sur la recherche", color: "3B82F6" },
  { title: "Design full custom", desc: "Aucune librairie UI (pas de NativeBase, UI Kitten), tout en View/Text/StyleSheet", color: C.red },
  { title: "Code propre", desc: "TypeScript, composants réutilisables, séparation des responsabilités, architecture claire", color: "8B5CF6" },
];

bonuses.forEach((b, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.5 + col * 3.1;
  const y = 1.2 + row * 2.1;

  s10.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.8, h: 1.8, fill: { color: C.white }, shadow: makeShadow() });
  // Color circle
  s10.addShape(pres.shapes.OVAL, { x: x + 1.05, y: y + 0.2, w: 0.5, h: 0.5, fill: { color: b.color, transparency: 80 } });
  s10.addShape(pres.shapes.OVAL, { x: x + 1.15, y: y + 0.3, w: 0.3, h: 0.3, fill: { color: b.color } });
  s10.addText(b.title, { x: x + 0.15, y: y + 0.8, w: 2.5, h: 0.35, fontSize: 13, fontFace: "Calibri", color: C.text, bold: true, align: "center", margin: 0 });
  s10.addText(b.desc, { x: x + 0.15, y: y + 1.1, w: 2.5, h: 0.55, fontSize: 10, fontFace: "Calibri", color: C.grayDark, align: "center", lineSpacingMultiple: 1.2, margin: 0 });
});

// ============================================================
// SLIDE 11 - Conclusion
// ============================================================
let s11 = pres.addSlide();
s11.background = { color: C.darkBg };

// Decorative shapes
s11.addShape(pres.shapes.OVAL, { x: 7, y: -1, w: 5, h: 5, fill: { color: C.green, transparency: 12 } });
s11.addShape(pres.shapes.OVAL, { x: 8, y: 0, w: 3, h: 3, fill: { color: C.greenLight, transparency: 18 } });
s11.addShape(pres.shapes.OVAL, { x: -2, y: 3, w: 5, h: 5, fill: { color: C.green, transparency: 8 } });

s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 0.6, h: 0.06, fill: { color: C.green } });

s11.addText("Merci !", {
  x: 0.8, y: 1.7, w: 6, h: 1.0,
  fontSize: 48, fontFace: "Arial Black", color: C.white, bold: true, margin: 0,
});

s11.addText("NutriScan SUPINFO", {
  x: 0.8, y: 2.7, w: 6, h: 0.5,
  fontSize: 22, fontFace: "Calibri", color: C.greenLight, margin: 0,
});

s11.addText("Scannez. Comprenez. Mangez mieux.", {
  x: 0.8, y: 3.2, w: 6, h: 0.4,
  fontSize: 16, fontFace: "Calibri", color: C.gray, italic: true, margin: 0,
});

// Stats bar at bottom
s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 8.4, h: 0.06, fill: { color: C.green, transparency: 50 } });

const stats = [
  { value: "8", label: "Écrans" },
  { value: "21", label: "Fichiers source" },
  { value: "4", label: "Contexts React" },
  { value: "3", label: "Scores affichés" },
];

stats.forEach((stat, i) => {
  const x = 0.8 + i * 2.2;
  s11.addText(stat.value, { x, y: 4.4, w: 1.5, h: 0.5, fontSize: 32, fontFace: "Arial Black", color: C.green, margin: 0 });
  s11.addText(stat.label, { x, y: 4.85, w: 1.5, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.gray, margin: 0 });
});

// Write file
const outputPath = "C:\\Users\\leonb\\OneDrive\\Documents\\3react\\NutriScan_Presentation.pptx";
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log("Presentation created: " + outputPath);
}).catch(err => {
  console.error("Error:", err);
});
