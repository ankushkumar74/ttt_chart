import React, { useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './index.css'

function App() {
  const [chartData, setChartData] = useState(null);
  const [btnc,setBtnc]=useState(false);



  function handleButtonClick() {
    setBtnc(
      true
    )
    axios.get('https://www.terriblytinytales.com/test.txt')
      .then(response => {
        const textContent = response.data;
        const wordArray = textContent.split(/\s+/);
        const wordFrequency = {};

        wordArray.forEach(word => {
          wordFrequency[word] = wordFrequency[word] ? wordFrequency[word] + 1 : 1;
        });

        const sortedWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
        const top20Words = sortedWords.slice(0, 20);
        const chartData = {
          labels: top20Words.map(word => word[0]),
          data: top20Words.map(word => word[1]),
        };

        setChartData(chartData);
      })
      .catch(error => {
        console.error('Error fetching text file:', error);
      });
  }

  function handleExportClick() {
    if (chartData) {
      const csvContent = 'data:text/csv;charset=utf-8,' + chartData.labels.join(',') + '\n' + chartData.data.join(',');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'histogram.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  React.useEffect(() => {
    if (chartData) {
      const ctx = document.getElementById('chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Word Frequency',
            data: chartData.data,
            backgroundColor: 'rgb(27, 156, 133,0.6)',
            borderColor: 'rgb(27, 156, 133,1)',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [chartData]);

  return (
    <div className='container'>
      { !btnc &&  <button id='submit' onClick={handleButtonClick} type="button">Submit</button>}
      {chartData && <button id='export' onClick={handleExportClick} type="button">Export</button>}
      {chartData && <canvas id="chart" ></canvas>}
      
    </div>
  );
}

export default App;
