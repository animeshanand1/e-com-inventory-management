import React from 'react';

const KPIWidget = ({ title, value, icon, colorClass }) => {
  return (
    <div className="col-md-6 col-lg-3 mb-4">
      <div className="kpi-widget">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{title}</h5>
            <h2>{value}</h2>
          </div>
          <div className={`kpi-icon text-white ${colorClass}`}>
            <i className={`bi ${icon}`} style={{fontSize:'10px'}}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIWidget;