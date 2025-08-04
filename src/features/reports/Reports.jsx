import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllItems } from '../inventory/inventorySlice';
import BarChart from '../../components/common/BarChart';

const Reports = () => {
  const items = useSelector(selectAllItems);

  const categoryData = useMemo(() => {
    const data = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {});
    
    return {
      labels: Object.keys(data),
      values: Object.values(data)
    };
  }, [items]);

  return (
    <div>
      <div className="table-container p-4">
        <h4 className="mb-4">Item Quantities by Category</h4>
        {items.length > 0 ? (
          <BarChart 
            data={categoryData.values}
            labels={categoryData.labels}
            title="Category Stock Levels"
          />
        ) : (
          <p className="text-center text-secondary">No inventory data available to generate reports.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;