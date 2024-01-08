import logo from './logo.svg';
import './App.css';
import LogBookApp from './Components/logbook';
import { Allroutes } from './Routes/Allroutes';

function App() {
  return (
    <div className="App">
      <LogBookApp/>
      <Allroutes/>
    </div>
  );
}

export default App;
