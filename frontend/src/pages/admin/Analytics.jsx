import { useState, useEffect, useCallback } from "react";
import {
  getAnalyticsSummary,
  getDeliveriesPerDay,
  getFuelTrend,
  getDriverUtilization,
} from "../../api/endpoints";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import "./Analytics.css";

const DAYS_OPTIONS = [7, 14, 30];

const COLORS = ["#1D9E75", "#378ADD", "#BA7517", "#E24B4A"];

const Analytics = () => {
  const [days, setDays]               = useState(7);
  const [summary, setSummary]         = useState(null);
  const [deliveries, setDeliveries]   = useState([]);
  const [fuelTrend, setFuelTrend]     = useState([]);
  const [driverUtil, setDriverUtil]   = useState([]);
  const [loading, setLoading]         = useState(true);

  const fetchAll = useCallback(async (d) => {
    setLoading(true);
    try {
      const [s, del, fuel, util] = await Promise.all([
        getAnalyticsSummary(d),
        getDeliveriesPerDay(d),
        getFuelTrend(d),
        getDriverUtilization(),
      ]);
      setSummary(s.data);
      setDeliveries(del.data.map((r) => ({
        date: new Date(r.date).toLocaleDateString("en-MY", { month: "short", day: "numeric" }),
        count: r.count,
      })));
      setFuelTrend(fuel.data.map((r) => ({
        date: new Date(r.day).toLocaleDateString("en-MY", { month: "short", day: "numeric" }),
        cost: r.total_cost,
        avgPerL: r.avg_per_liter,
      })));
      setDriverUtil(util.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(days); }, [days]);

  const statusData = [
    { name: "Delivered", value: summary?.delivered ?? 0 },
    { name: "Delivering", value: summary?.delivering ?? 0 },
    { name: "Pending", value: summary?.pending ?? 0 },
    { name: "Cancelled", value: summary?.cancelled ?? 0 },
  ];

  return (
    <div className="analyticsPage">
      <div className="analyticsHeader">
        <div>
          <h2>Analytics</h2>
          <p className="analyticsSubtitle">Delivery and fleet performance</p>
        </div>
        <div className="dayFilter">
          {DAYS_OPTIONS.map((d) => (
            <button
              key={d}
              className={`filterChip ${days === d ? "active" : ""}`}
              onClick={() => setDays(d)}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="analyticsLoading"><p>Loading analytics...</p></div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="metricsGrid">
            <div className="metricCard">
              <p className="metricLabel">Total deliveries</p>
              <p className="metricValue">{summary?.totalDeliveries ?? "—"}</p>
            </div>
            <div className="metricCard">
              <p className="metricLabel">Fuel spend (RM)</p>
              <p className="metricValue">
                {summary?.totalFuelSpend != null
                  ? summary.totalFuelSpend.toLocaleString("en-MY", { minimumFractionDigits: 2 })
                  : "—"}
              </p>
            </div>
            <div className="metricCard">
              <p className="metricLabel">Avg RM / liter</p>
              <p className="metricValue">
                {summary?.avgPricePerLiter != null
                  ? summary.avgPricePerLiter.toFixed(2)
                  : "—"}
              </p>
            </div>
            <div className="metricCard">
              <p className="metricLabel">Fleet utilization</p>
              <p className="metricValue">
                {summary?.utilization != null ? `${summary.utilization}%` : "—"}
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="chartsRow">
            <div className="chartCard wide">
              <h4>Deliveries per day</h4>
              {deliveries.length === 0 ? (
                <p className="noData">No delivery data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={deliveries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#378ADD" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="chartCard">
              <h4>Status breakdown</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="chartsRow">
            <div className="chartCard wide">
              <h4>Fuel cost trend (RM)</h4>
              {fuelTrend.length === 0 ? (
                <p className="noData">No fuel data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={fuelTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#D85A30"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="chartCard">
              <h4>Driver utilization</h4>
              <div className="driverUtilList">
                {driverUtil.length === 0 ? (
                  <p className="noData">No driver data</p>
                ) : (
                  driverUtil.map((d) => (
                    <div key={d.id} className="utilRow">
                      <div className="utilAvatar">
                        {d.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="utilName">{d.name}</span>
                      <div className="utilBarWrap">
                        <div
                          className="utilBarFill"
                          style={{ width: `${d.utilization}%` }}
                        />
                      </div>
                      <span className="utilPct">{d.utilization}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;