import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from './components/ui/sonner.tsx'
import {NextUIProvider} from '@nextui-org/react'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <QueryClientProvider client={queryClient}>
  <NextUIProvider>
  <App />
  </NextUIProvider>
  <Toaster/>
  </QueryClientProvider>
  </StrictMode>,
)
