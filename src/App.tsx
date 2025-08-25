import { BrowserRouter, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import { store } from './store'

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
