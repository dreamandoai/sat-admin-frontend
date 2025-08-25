import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import { store } from './store'

import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./layouts/PrivateRoute";
import AdminPortal from "./pages/AdminPortal";

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/portal" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="portal" element={<AdminPortal />} />
          </Route>
          <Route path="*" element={<Navigate to="/portal" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
