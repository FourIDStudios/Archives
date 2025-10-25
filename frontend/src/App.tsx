import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MessagesPage } from './pages/MessagesPage';
import './App.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function HomePage() {
  console.log('HomePage component is rendering');
  
  return (
    <div className="page-container">
      <div className="max-w-6xl container">
        <h1 className="text--3xl text--bold text--gray-900 mb--4">
          Discord Archive System
        </h1>
        <p className="text--success mb--2">
          ✅ All components working!
        </p>
        <p className="text--gray-600">
          Navigate to <a href="/messages" className="text--primary underline">/messages</a> to see the MessagesPage
        </p>
      </div>
    </div>
  );
}

function App() {
  console.log('App component is rendering - TESTING MESSAGES PAGE');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:id" element={<MessagesPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
