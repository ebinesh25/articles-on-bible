# API Configuration Guide

## Overview

This application now includes a complete API integration system that allows you to fetch content from a backend API server. The API URL is configurable via environment variables, making it easy to switch between development, staging, and production environments.

## 🔧 Environment Configuration

### Environment Variables

Add the following environment variable to your `.env` files:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
```

### Environment Files Setup

#### Development (`.env.development`)
```bash
VITE_API_URL=http://localhost:8000
```

#### Production (`.env.production`)
```bash
VITE_API_URL=https://your-production-api.com
```

#### Local Override (`.env.local`)
```bash
# Create this file to override any environment
VITE_API_URL=http://localhost:3001
```

## 📁 API Integration Files

The following files have been added for API integration:

- **`src/utils/apiConfig.ts`** - API configuration utilities
- **`src/utils/apiClient.ts`** - HTTP client with error handling
- **`src/hooks/useApi.ts`** - React hooks for API interactions
- **`src/components/ApiDebug.tsx`** - Development debugging component
- **`src/components/ApiExample.tsx`** - Example usage component

## 🚀 Usage Examples

### Basic API Usage

```typescript
import { useArticles, useApiHealth } from '../hooks/useApi';

const MyComponent = () => {
  const { data: articles, loading, error, fetchArticles } = useArticles();
  const { checkHealth } = useApiHealth();

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {articles && articles.map(article => (
        <div key={article.id}>{article.title.english}</div>
      ))}
    </div>
  );
};
```

### Direct API Client Usage

```typescript
import { apiClient, articleService } from '../utils/apiClient';

// Using the generic client
const data = await apiClient.get('/api/custom-endpoint');

// Using specific services
const articles = await articleService.getArticles();
const article = await articleService.getArticle('article-id');
```

### Health Check

```typescript
import { useApiHealth } from '../hooks/useApi';

const HealthCheck = () => {
  const { data, loading, checkHealth } = useApiHealth();

  return (
    <button onClick={checkHealth} disabled={loading}>
      {loading ? 'Checking...' : 'Check API Health'}
    </button>
  );
};
```

## 🔗 Expected API Endpoints

Your API server should implement the following endpoints:

### Health Check
- **GET** `/api/health`
- **Response**: `{ "status": "ok", "timestamp": "2025-01-01T00:00:00Z" }`

### Articles
- **GET** `/api/articles` - Get all articles
- **GET** `/api/articles/:id` - Get single article
- **POST** `/api/articles` - Create new article
- **PUT** `/api/articles/:id` - Update article
- **DELETE** `/api/articles/:id` - Delete article

### Content
- **GET** `/api/content` - Get content data
- **PUT** `/api/content` - Update content data

## 🛠 Development Tools

### API Debug Panel

In development mode, an API debug panel appears in the bottom-right corner with:
- Current API configuration
- Health check functionality
- Custom endpoint testing
- Available endpoints list

### API Example Page

You can create a test route to view the API example:

```typescript
// Add to your router
<Route path="/api-test" element={<ApiExample />} />
```

Then visit `http://localhost:5173/api-test` to see the API integration in action.

## 🔍 Debugging

### Check Current Configuration

```typescript
import { getApiStatus } from '../utils/apiConfig';

console.log('API Status:', getApiStatus());
```

### Environment Variables Debug

```typescript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Mode:', import.meta.env.MODE);
```

### Network Errors

The API client includes comprehensive error handling:
- Timeout errors (10 seconds default)
- HTTP status errors
- Network connectivity errors
- JSON parsing errors

## 📦 TypeScript Types

The API integration includes full TypeScript support:

```typescript
// Article data structure
interface ArticleData {
  id?: string;
  title: {
    tamil: string;
    english: string;
  };
  content: {
    tamil: Array<{ type: string; value: string }>;
    english: Array<{ type: string; value: string }>;
  };
  theme?: string;
}

// API state structure
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

## 🌐 Deployment

### Netlify

The `netlify.toml` file is configured with the API URL:

```toml
[build.environment]
  VITE_API_URL = "https://your-production-api.com"
```

### Other Platforms

Set the environment variable in your deployment platform:
- **Vercel**: Add to Environment Variables in dashboard
- **Heroku**: Use `heroku config:set VITE_API_URL=https://your-api.com`
- **Docker**: Include in your `docker-compose.yml` or Dockerfile

## 🔒 Error Handling

The API client includes robust error handling:

```typescript
try {
  const data = await articleService.getArticles();
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('URL:', error.url);
  }
}
```

## 🎯 Best Practices

1. **Always handle loading states** in your components
2. **Use the provided hooks** instead of direct fetch calls
3. **Set up proper error boundaries** for API errors
4. **Configure timeouts** appropriate for your use case
5. **Use TypeScript types** for better development experience

## 🚦 Getting Started

1. **Set up your environment file**:
   ```bash
   echo "VITE_API_URL=http://localhost:8000" >> .env.development
   ```

2. **Start your API server** at `http://localhost:8000`

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Check the API debug panel** in the bottom-right corner

5. **Test your API endpoints** using the debug panel

Your application is now ready to communicate with your API server! 🎉
