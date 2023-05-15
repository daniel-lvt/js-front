import './App.css';

import Section from './components/Section/Section'
import { CategoryScale, ArcElement, Tooltip, Legend, Title, BarElement,LinearScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale, ArcElement, Tooltip, Legend, Title, BarElement,
  LinearScale);

function App() {
  return (
    <div className="App">
      <Section
      />
    </div>
  );
}

export default App;
