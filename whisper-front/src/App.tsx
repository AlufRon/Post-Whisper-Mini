import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import MenuComponent from './Menu/Menu';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import AppRoutes from './Router/AppRoutes';

function App() {
  return (
    <Router>

      <ThemeProvider theme={theme}>
        <div className="App">
          <MenuComponent />
          <div className='App-Content'>
            <AppRoutes />
          </div>
        </div>
      </ThemeProvider>
    </Router>

  );
}

export default App;
