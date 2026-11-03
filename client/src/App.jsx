import Home from './pages/Home'

export default function App() {
  return <Home />
}

// import react, { useState, useEffect } from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import MainLayout from './layouts/MainLayout'
// import Home from './pages/Home'
// import Product from './pages/Product'

// export default function App() {
//   const [activePath, setActivePath] = useState(window.location.pathname)

//   useEffect(() => {
//     const handlePopState = () => {
//       setActivePath(window.location.pathname)
//     }

//     window.addEventListener('popstate', handlePopState)

//     return () => {
//       window.removeEventListener('popstate', handlePopState)
//     }
//   }, [])

//   const handleNavigate = (path) => {
//     if (path !== activePath) {
//       window.history.pushState(null, '', path)
//       setActivePath(path)
//     }
//   }

//   return (
//     <Router>
//       <MainLayout>
//         <Routes>
//           <Route
//             path="/"
//             element={<Home activePath={activePath} onNavigate={handleNavigate} />}
//           />
//           <Route
//             path="/products"
//             element={<Product activePath={activePath} onNavigate={handleNavigate} />}
//           />
//         </Routes>
//       </MainLayout>
//     </Router>
//   )
// }