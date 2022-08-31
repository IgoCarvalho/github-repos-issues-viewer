import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Repository from './pages/Repository';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/repositorio/:repoName" element={<Repository />} />
    </Routes>
  );
}

export default AppRoutes;
