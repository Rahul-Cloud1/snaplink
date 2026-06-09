import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import ClickLineChart from '../components/Charts/ClickLineChart.jsx';
import CountryBarChart from '../components/Charts/CountryBarChart.jsx';
import DevicePieChart from '../components/Charts/DevicePieChart.jsx';

const ranges = [
  ['7d', '7 days'],
  ['30d', '30 days'],
  ['all', 'All time']
];

export default function Analytics() {
  const { slug } = useParams();
  const [range, setRange] = useState('7d');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setError('');
      try {
        const response = await api.get(`/api/analytics/${slug}?range=${range}`);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not load analytics');
      }
    }

    load();
  }, [slug, range]);

  if (error) return <section className="workbench"><p className="error">{error}</p></section>;
  if (!data) return <section className="workbench"><div className="panel muted">Loading analytics...</div></section>;

  return (
    <section className="workbench analytics">
      <div className="toolbar">
        <div className="page-heading">
          <p>Analytics</p>
          <h1>/{slug}</h1>
        </div>
        <div className="segmented">
          {ranges.map(([value, label]) => (
            <button key={value} className={range === value ? 'active' : ''} onClick={() => setRange(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics">
        <div className="metric"><span>All time</span><strong>{data.totals.allTime}</strong></div>
        <div className="metric"><span>Today</span><strong>{data.totals.today}</strong></div>
        <div className="metric"><span>This week</span><strong>{data.totals.week}</strong></div>
      </div>

      <div className="chart-grid">
        <div className="panel chart-panel">
          <h2>Clicks over time</h2>
          <ClickLineChart data={data.clicksOverTime} />
        </div>
        <div className="panel chart-panel">
          <h2>Top countries</h2>
          <CountryBarChart data={data.countries} />
        </div>
        <div className="panel chart-panel">
          <h2>Devices</h2>
          <DevicePieChart data={data.devices} />
        </div>
        <div className="panel chart-panel">
          <h2>Top referrers</h2>
          <table>
            <tbody>
              {data.referrers.map((item) => (
                <tr key={item.referrer}>
                  <td>{item.referrer}</td>
                  <td>{item.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
