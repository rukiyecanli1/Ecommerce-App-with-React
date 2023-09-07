import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "./reset.css";
import reportWebVitals from './reportWebVitals';

//iyi görünümlü tablo, buton gibi elemanları kullanabilmek için
import { ChakraProvider } from "@chakra-ui/react"

//data'yi useeffect, usestate gibi hook'ları kullanmadan çekebilmek için
import { QueryClient,QueryClientProvider } from 'react-query'

//ekranda react-query aracını görüp ilgili işlemleri inceleyebilmek için
import { ReactQueryDevtools } from 'react-query/devtools'

//context
import { AuthProvider } from './contexts/AuthContext';
import { BasketProvider } from './contexts/BasketContext';



// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
    //farklı bir sayfaya gidip geri geldiğimde tekrar fetch yapmasın (backend'e istek atmasın)
    refetchOnMount: false,
    //farklı bir tab'a geçip geri geldiğimde de tekrar fetch yapmasın
    refetchOnWindowFocus: false,
    }
  }
})




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <QueryClientProvider client={queryClient}>
    <ChakraProvider>
    <AuthProvider>
    <BasketProvider>
    <App />
    </BasketProvider>
    </AuthProvider>
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen{...false} />
    </QueryClientProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
