import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import  Signin  from './pages/Signin'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs'
import { Toaster } from 'react-hot-toast'
import CreatePost from './pages/CreatePost'
import Landing from './pages/Landing'

function App() {

  return (
    <>
    <Toaster/>
    
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path='/create-blog' element={<CreatePost/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App