# Articles on Bible - Routing Documentation

## Overview
This application now uses React Router for dynamic routing, allowing each article to have its own URL based on the article ID from the content.json file.

## Route Structure

### Home Page
- **URL**: `/`
- **Component**: `HomePage`
- **Description**: Landing page displaying all articles with preview cards
- **Language Support**: `/?la=english` or `/?la=tamil`

### Article Pages
- **URL**: `/article/:id`
- **Component**: `DynamicComponentArticlePage`
- **Description**: Individual article pages where `:id` corresponds to the article ID from content.json
- **Language Support**: Add `?la=english` or `?la=tamil` to set language
- **Examples**:
  - `/article/weakness?la=english` - Displays "WEAKNESS?" in English
  - `/article/weakness?la=tamil` - Displays "பலவீனமா?" in Tamil
  - `/article/remember?la=english` - Displays "WILL YOU REMEMBER?" in English
  - `/article/remember?la=tamil` - Displays "நீங்கள் நினைவில் வைப்பீர்களா?" in Tamil
  - `/article/appreciation?la=english` - Displays "MUCH NEEDED" in English
  - `/article/hair-fall?la=english` - Displays "Are you worried about your hair fall?" in English
  - `/article/available?la=english` - Displays "AVAILABLE" in English
  - `/article/take-care?la=english` - Displays "TAKE CARE" in English

### 404 Page
- **URL**: Any invalid route (e.g., `/article/non-existent`)
- **Component**: `NotFoundPage`
- **Description**: Displayed when a user visits a non-existent route
- **Language Support**: Inherits language from URL parameter

## Available Article Routes

Based on the current content.json, the following article routes are available:

1. `/article/weakness` (English) / `/article/weakness?la=tamil` (Tamil)
2. `/article/remember` (English) / `/article/remember?la=tamil` (Tamil)
3. `/article/appreciation` (English) / `/article/appreciation?la=tamil` (Tamil)
4. `/article/hair-fall` (English) / `/article/hair-fall?la=tamil` (Tamil)
5. `/article/available` (English) / `/article/available?la=tamil` (Tamil)
6. `/article/take-care` (English) / `/article/take-care?la=tamil` (Tamil)

## Language URL Parameters

### Query Parameter Support
- **Parameter**: `la` (language)
- **Values**: `english` | `tamil`
- **Default**: `tamil` (if no parameter provided)
- **Examples**:
  - `/?la=english` - Home page in English
  - `/article/weakness?la=english` - Article in English
  - `/article/weakness?la=tamil` - Article in Tamil

### Automatic Language Persistence
- Language selection is automatically added to all navigation links
- When user changes language, URL is updated with the new language parameter
- Direct URL access with language parameter will render the page in that language

## Features

### Language Support
- All pages support both Tamil and English languages
- Language preference is maintained across route changes via URL parameters
- Direct URL access respects language parameter (e.g., `?la=english`)
- SEO meta tags are updated based on the selected language
- Automatic URL updates when language is changed via UI

### SEO Optimization
- Dynamic page titles based on article content
- Meta descriptions generated from article text
- Proper 404 page handling

### Navigation
- Home page cards link to individual articles
- Article pages include navigation back to home
- Article pages show related articles at the bottom
- Breadcrumb navigation via the header logo

### URL Structure Benefits
- **Shareable URLs**: Each article has a unique, shareable URL
- **SEO Friendly**: Search engines can index individual articles
- **Bookmarkable**: Users can bookmark specific articles
- **Direct Access**: Direct links to articles work properly

## Technical Implementation

### Components Structure
```
src/
├── components/
│   ├── HomePage.tsx                    # Home page with article grid
│   ├── DynamicComponentArticlePage.tsx # Individual article display
│   └── NotFoundPage.tsx               # 404 error page
├── hooks/
│   └── useSEO.ts         # SEO meta tag management
├── types/
│   └── index.ts          # Shared TypeScript types
└── App.tsx               # Router configuration
```

### Router Configuration
```typescript
<Router>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/article/:id" element={<DynamicComponentArticlePage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Router>
```

## Adding New Articles

To add new articles:

1. Add the article data to `src/data/content.json` following the existing structure
2. The article will automatically be available at `/article/{your-article-id}`
3. No additional routing configuration needed

## Usage Examples

### Direct URL Access with Language
```
# English versions
http://localhost:5173/?la=english
http://localhost:5173/article/take-care?la=english
http://localhost:5173/article/weakness?la=english

# Tamil versions  
http://localhost:5173/?la=tamil
http://localhost:5173/article/take-care?la=tamil
http://localhost:5173/article/weakness?la=tamil

# Default (Tamil) - without parameter
http://localhost:5173/
http://localhost:5173/article/take-care
```

### Navigation to Articles
```typescript
// From HomePage component - using Link component with language preservation
<Link to={getUrlWithLanguage(`/article/${page.id}`, language)} className="...">
  {/* Article preview card */}
</Link>

// Programmatic navigation with language - using useNavigate hook
const navigate = useNavigate();
navigate(getUrlWithLanguage(`/article/${articleId}`, language));
```

### Language Parameter Management
```typescript
// Reading language from URL
const urlParams = new URLSearchParams(location.search);
const language = urlParams.get('la') || 'tamil';

// Updating URL with language
const handleLanguageChange = (newLanguage: Language) => {
  const urlParams = new URLSearchParams(location.search);
  urlParams.set('la', newLanguage);
  navigate({
    pathname: location.pathname,
    search: urlParams.toString()
  }, { replace: true });
};
```

### URL Parameters Access
```typescript
// In DynamicComponentArticlePage component
const { id } = useParams<{ id: string }>();
const page = pages.find(p => p.id === id);
```

This routing implementation provides a solid foundation for the Bible articles application with proper URL structure, SEO optimization, and user-friendly navigation.

## Deployment Configuration

### Netlify Deployment
For deployment on Netlify, the project includes both `_redirects` and `netlify.toml` files to handle client-side routing:

#### _redirects file
```
/* /index.html 200
```

#### netlify.toml file
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

These files ensure that:
- Direct URL access to routes like `/article/weakness?la=english` works correctly
- Browser refresh on any route doesn't result in 404 errors
- All routes are handled by React Router instead of the server

### Build and Deploy
```bash
# Build the project
npm run build

# The dist/ folder will contain:
# - index.html (main app)
# - _redirects (Netlify routing config)
# - assets/ (CSS, JS files)
```

Deploy the `dist/` folder to Netlify, and all routes will work correctly with the redirect configuration.
