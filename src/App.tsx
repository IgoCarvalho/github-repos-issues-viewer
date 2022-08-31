import { BrowserRouter } from 'react-router-dom';

import GlobalStyles from './styles/global';

import AppRoutes from './routes';

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
