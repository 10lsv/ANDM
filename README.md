# NutriScan

Application mobile de scan alimentaire développée en **React Native** avec **Expo**, inspirée de Yuka. Scannez les codes-barres de vos produits alimentaires pour obtenir instantanément leur score nutritionnel, leurs ingrédients et bien plus encore.

> Projet réalisé dans le cadre du module React Native — SUPINFO Bac+3

---

## Fonctionnalités

### Essentielles

- **Scanner de codes-barres** — Scan en temps réel (EAN-13, EAN-8, UPC) via la caméra avec retour haptique
- **Fiche produit détaillée** — Nutri-Score, NOVA, Eco-Score, tableau nutritionnel, ingrédients, allergènes
- **Historique des scans** — Consultation des derniers produits scannés avec dates relatives
- **Recherche de produits** — Recherche par nom avec auto-complétion et cache intelligent
- **Navigation fluide** — Tab Navigator + Stack Navigator avec animations natives

### Différenciantes

- **Comparateur** — Comparaison côte à côte de 2 produits avec indicateurs visuels (vert/rouge)
- **Profil allergènes** — Configuration de 14 allergènes courants avec alertes automatiques au scan
- **Dashboard nutrition** — Suivi calorique journalier avec barre de progression animée
- **Favoris catégorisés** — Organisation par catégories personnalisables (Petit-déjeuner, Snacks, Boissons, Repas)
- **Mode sombre** — Thème dark/light avec persistance du choix

### Bonus

- Animations natives (fade-in, slide, scan line, pulse)
- Retour haptique au scan
- Partage de fiches produits
- Design responsive iOS & Android

---

## Technologies

| Technologie             | Usage                                            |
| ----------------------- | ------------------------------------------------ |
| **React Native**        | Framework mobile cross-platform                  |
| **Expo SDK 54**         | Toolchain & runtime                              |
| **TypeScript**          | Typage statique                                  |
| **React Navigation 7**  | Navigation (Bottom Tabs + Stack)                 |
| **expo-camera**         | Scan de codes-barres                             |
| **expo-haptics**        | Retour haptique                                  |
| **AsyncStorage**        | Persistance locale (historique, favoris, profil) |
| **Open Food Facts API** | Base de données produits alimentaires            |

---

## Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── LoadingSpinner.tsx
│   ├── NutriScoreBadge.tsx
│   ├── ProductCard.tsx
│   └── SearchBar.tsx
├── context/             # State management (React Context)
│   ├── ThemeContext.tsx
│   ├── HistoryContext.tsx
│   ├── FavoritesContext.tsx
│   └── ProfileContext.tsx
├── hooks/               # Custom hooks
│   └── useTheme.ts
├── navigation/          # Configuration navigation
│   └── AppNavigator.tsx
├── screens/             # Écrans de l'application
│   ├── HomeScreen.tsx
│   ├── ScannerScreen.tsx
│   ├── ProductDetailScreen.tsx
│   ├── SearchScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── ComparatorScreen.tsx
│   └── ProfileScreen.tsx
├── types/               # Interfaces TypeScript
│   └── index.ts
└── utils/               # Fonctions utilitaires + API
    ├── api.ts
    └── helpers.ts
```

---

## Installation

```bash
# Cloner le repository
git clone https://github.com/LeonBecquet/3react.git
cd 3react

# Installer les dépendances
npm install

# Lancer le serveur de développement
npx expo start
```

### Tester sur mobile

1. Installer **Expo Go** sur votre téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scanner le QR code affiché dans le terminal
3. Si le téléphone est sur un réseau différent du PC :
   ```bash
   npx expo start --tunnel
   ```

---

## API

L'application utilise l'**API Open Food Facts** (gratuite et open source) :

- **Scan** : `https://world.openfoodfacts.org/api/v2/product/{barcode}`
- **Recherche** : `https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}`

Optimisations implémentées :

- Debounce 400ms sur la recherche
- Cache en mémoire avec TTL de 5 minutes
- AbortController pour annuler les requêtes obsolètes

---

- **Léon Becquet**
- **Leo Sauvey**
