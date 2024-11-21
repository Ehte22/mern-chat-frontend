import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Authentication from './pages/Authentication'
import Chat from './pages/Chat'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.min.css'
import Protected from './share/Protected'
import Test from './Test'

const App = () => {
  // return <Test />
  return <>
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        theme="dark"
      />
      <Routes>
        <Route path='/' element={<Authentication />} />
        <Route path='/chat' element={<Protected compo={<Chat />} />} />
        <Route path='*' element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App