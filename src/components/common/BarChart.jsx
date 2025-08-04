import React from 'react';

const BarChart = ({ data, labels, title }) => {
  const maxValue = Math.max(...data, 0);

  const chartStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '300px',
    borderLeft: '2px solid var(--border-color)',
    borderBottom: '2px solid var(--border-color)',
    padding: '10px 0',
  };

  const barStyle = (value) => ({
    height: `${(value / maxValue) * 100}%`,
    width: '50px',
    backgroundColor: 'var(--accent-primary)',
    transition: 'height 0.5s ease-out',
    borderRadius: '4px 4px 0 0',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    color: '#fff',
  });

  const valueStyle = {
    position: 'absolute',
    top: '-25px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
  };

  const labelStyle = {
    position: 'absolute',
    bottom: '-30px',
    width: '100px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    wordWrap: 'break-word'
  };

  return (
    <div className="w-100">
      <h5 className="text-center mb-4">{title}</h5>
      <div style={chartStyle}>
        {data.map((value, index) => (
          <div key={index} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={barStyle(value)} title={`${labels[index]}: ${value}`}>
              <span style={valueStyle}>{value}</span>
              <span style={labelStyle}>{labels[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;