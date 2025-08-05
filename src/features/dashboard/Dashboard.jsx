import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import KPIWidget from "./KPIWidget";
import { fetchDashboardSummary, selectDashboardSummary, selectDashboardStatus } from "./dashboardSlice";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  console.log('Dashboard component mounted');
  const dispatch = useDispatch();
  const dashboardStatus = useSelector(selectDashboardStatus);
  const summary = useSelector(selectDashboardSummary);
  console.log('Redux state:', { dashboardStatus, summary });

  useEffect(() => {
    if (dashboardStatus === "idle") {
      dispatch(fetchDashboardSummary());
    }
  }, [dashboardStatus, dispatch]);

  if (dashboardStatus === "loading") {
    return <Loader />;
  }

  const isAllZero = [summary.totalItems, summary.lowStockCount, summary.totalQuantity, summary.totalValue, summary.totalRevenue].every(v => v === 0);
  let fallback = null;
  if (isAllZero && summary.productCount !== undefined) {
    fallback = (
      <div className="alert alert-warning mt-3">Raw backend response:<br />
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div>
        <div className="row">
          <KPIWidget
            title="Total Items"
            value={summary.totalItems}
            icon="bi-box-seam"
            colorClass="bg-primary"
          />
          <KPIWidget
            title="Low Stock Items"
            value={summary.lowStockCount}
            icon="bi-exclamation-triangle"
            colorClass="bg-warning"
          />
          <KPIWidget
            title="Total Quantity"
            value={summary.totalQuantity}
            icon="bi-collection"
            colorClass="bg-success"
          />
          <KPIWidget
            title="Total Inventory Value"
            value={`INR${summary.totalValue.toLocaleString()}`}
            icon="bi-currency-dollar"
            colorClass="bg-info"
          />
          <KPIWidget
            title="Total Revenue"
            value={`INR${summary.totalRevenue.toLocaleString()}`}
            icon="bi-graph-up-arrow"
            colorClass="bg-success"
          />
        </div>
        {fallback}
      </div>
    </div>
  );
};

export default Dashboard;
