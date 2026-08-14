"use client";

import { FormEvent, useMemo, useState } from "react";

type Period = "Daily" | "Weekly" | "Monthly";

const employees = {
  "1024": { name: "Maya Thompson", role: "Document Specialist", shift: "Morning · 7:00 AM–3:30 PM", initials: "MT" },
  "2048": { name: "Jordan Lee", role: "Scanning Associate", shift: "Day · 9:00 AM–5:30 PM", initials: "JL" },
  "3072": { name: "Avery Patel", role: "Quality Analyst", shift: "Evening · 2:00 PM–10:30 PM", initials: "AP" },
} as const;

const records = [
  { day: "Mon", date: "Aug 10", scanned: 1184, good: 1161, bad: 23, quality: 98.1, downtime: 18, reason: "Scanner calibration" },
  { day: "Tue", date: "Aug 11", scanned: 1268, good: 1249, bad: 19, quality: 98.5, downtime: 12, reason: "System update" },
  { day: "Wed", date: "Aug 12", scanned: 1216, good: 1199, bad: 17, quality: 98.6, downtime: 8, reason: "Paper jam" },
  { day: "Thu", date: "Aug 13", scanned: 1324, good: 1309, bad: 15, quality: 98.9, downtime: 6, reason: "Paper jam" },
  { day: "Fri", date: "Aug 14", scanned: 1284, good: 1270, bad: 14, quality: 98.9, downtime: 9, reason: "Network delay" },
];

const trendSets: Record<Period, { labels: string[]; values: number[]; quality: number[] }> = {
  Daily: { labels: ["7 AM", "9 AM", "11 AM", "1 PM", "3 PM"], values: [168, 312, 278, 326, 200], quality: [98.1, 98.5, 98.7, 98.9, 98.9] },
  Weekly: { labels: records.map((r) => r.day), values: records.map((r) => r.scanned), quality: records.map((r) => r.quality) },
  Monthly: { labels: ["Week 1", "Week 2", "Week 3", "Week 4"], values: [5820, 6035, 6172, 6276], quality: [97.8, 98.2, 98.5, 98.6] },
};

function MiniIcon({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`mini-icon ${tone}`}>{children}</span>;
}

export default function Home() {
  const [input, setInput] = useState("1024");
  const [employeeId, setEmployeeId] = useState<keyof typeof employees | null>(null);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("Weekly");

  const employee = employeeId ? employees[employeeId] : null;
  const trend = trendSets[period];
  const maxTrend = Math.max(...trend.values);
  const totals = useMemo(() => records.reduce((a, r) => ({ scanned: a.scanned + r.scanned, good: a.good + r.good, bad: a.bad + r.bad, downtime: a.downtime + r.downtime }), { scanned: 0, good: 0, bad: 0, downtime: 0 }), []);

  function lookup(e: FormEvent) {
    e.preventDefault();
    const id = input.trim() as keyof typeof employees;
    if (!employees[id]) {
      setError("We couldn’t find that employee ID. Try 1024, 2048, or 3072.");
      return;
    }
    setEmployeeId(id);
    setError("");
  }

  if (!employee) {
    return (
      <main className="login-page">
        <section className="login-card">
          <div className="brand-mark">P</div>
          <p className="eyebrow">Performance portal</p>
          <h1>Your work, in focus.</h1>
          <p className="login-copy">Enter your employee ID to see your latest productivity and quality metrics.</p>
          <form onSubmit={lookup}>
            <label htmlFor="employee-id">Employee ID</label>
            <div className="input-row">
              <input id="employee-id" inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 1024" autoFocus />
              <button type="submit">View dashboard <span>→</span></button>
            </div>
            {error && <p className="error" role="alert">{error}</p>}
          </form>
          <p className="demo-note"><span>Demo</span> Try employee ID 1024</p>
        </section>
        <aside className="login-art" aria-hidden="true">
          <div className="art-orb one" /><div className="art-orb two" />
          <div className="quote-card"><span>“</span><p>Clarity turns everyday work into meaningful progress.</p><small>YOUR PERFORMANCE, SIMPLIFIED</small></div>
        </aside>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header>
        <div className="wordmark"><span className="brand-mark small">P</span><span>Pulse</span></div>
        <div className="header-right"><span className="live"><i /> Updated today, 3:42 PM</span><button className="profile" onClick={() => setEmployeeId(null)} title="Switch employee"><span>{employee.initials}</span><b>{employee.name}</b><em>⌄</em></button></div>
      </header>

      <section className="content">
        <div className="welcome">
          <div><p className="eyebrow">Friday, August 14</p><h1>Good afternoon, {employee.name.split(" ")[0]}.</h1><p>Here’s how your work is tracking this week.</p></div>
          <div className="identity"><span>{employee.initials}</span><div><strong>{employee.role}</strong><small>ID {employeeId} · {employee.shift}</small></div></div>
        </div>

        <nav className="period-tabs" aria-label="Report period">
          {(["Daily", "Weekly", "Monthly"] as Period[]).map((p) => <button key={p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)}>{p}</button>)}
          <button className="date-button">Aug 10 – Aug 14 <span>⌄</span></button>
        </nav>

        <section className="kpis">
          <article><div className="card-top"><MiniIcon>▤</MiniIcon><span className="positive">↑ 4.8%</span></div><p>Pages scanned</p><h2>{period === "Daily" ? "1,284" : period === "Monthly" ? "24,303" : totals.scanned.toLocaleString()}</h2><small>Target: {period === "Daily" ? "1,200" : period === "Monthly" ? "24,000" : "6,000"}</small><div className="progress"><i style={{width:"100%"}} /></div></article>
          <article><div className="card-top"><MiniIcon tone="green">✓</MiniIcon><span className="positive">↑ 0.6%</span></div><p>Quality score</p><h2>98.6%</h2><small>Target: 98.0%</small><div className="progress green"><i style={{width:"98.6%"}} /></div></article>
          <article><div className="card-top"><MiniIcon tone="amber">◷</MiniIcon><span className="positive">↓ 14 min</span></div><p>Downtime</p><h2>{period === "Daily" ? "9 min" : period === "Monthly" ? "3h 12m" : `${totals.downtime} min`}</h2><small>Weekly limit: 90 min</small><div className="progress amber"><i style={{width:"59%"}} /></div></article>
          <article><div className="card-top"><MiniIcon tone="violet">◎</MiniIcon><span className="positive">↑ 3.2%</span></div><p>Target achieved</p><h2>104.6%</h2><small>276 pages above target</small><div className="progress violet"><i style={{width:"100%"}} /></div></article>
        </section>

        <section className="charts-grid">
          <article className="panel scan-panel"><div className="panel-title"><div><h3>Pages scanned</h3><p>{period} volume against target</p></div><span className="legend"><i /> Actual <i className="target-dot" /> Target</span></div>
            <div className="bar-chart">{trend.values.map((v, i) => <div className="bar-column" key={trend.labels[i]}><div className="bar-space"><span className="target-line" /><i style={{height:`${Math.max(15, (v / maxTrend) * 100)}%`}}><b>{v.toLocaleString()}</b></i></div><small>{trend.labels[i]}</small></div>)}</div>
          </article>
          <article className="panel quality-panel"><div className="panel-title"><div><h3>Quality trend</h3><p>Accuracy over time</p></div><strong className="quality-big">98.6%<small>avg.</small></strong></div>
            <div className="quality-chart">{trend.quality.map((q, i) => <div className="q-column" key={i}><div className="q-track"><i style={{height:`${(q - 96) * 25 + 24}%`}}><b>{q}%</b></i></div><small>{trend.labels[i]}</small></div>)}</div>
          </article>
        </section>

        <section className="bottom-grid">
          <article className="panel downtime"><div className="panel-title"><div><h3>Downtime</h3><p>53 minutes this week</p></div><button>View details →</button></div>
            <div className="donut-row"><div className="donut"><span><b>53</b><small>minutes</small></span></div><ul><li><i className="blue-dot" /><span>Scanner calibration</span><b>18 min</b></li><li><i className="purple-dot" /><span>System update</span><b>12 min</b></li><li><i className="orange-dot" /><span>Paper jams</span><b>14 min</b></li><li><i className="gray-dot" /><span>Network delay</span><b>9 min</b></li></ul></div>
          </article>
          <article className="panel insight"><p className="eyebrow">Weekly insight</p><h3>You’re on a roll.</h3><p>Your quality score improved three days in a row while scanning 4.8% more pages than last week.</p><div><span>★</span><small>Best day</small><strong>Thursday · 1,324 pages</strong></div></article>
        </section>

        <section className="panel table-panel"><div className="panel-title"><div><h3>Daily results</h3><p>A complete breakdown of this week</p></div><button onClick={() => window.print()}>Export report ↗</button></div>
          <div className="table-scroll"><table><thead><tr><th>Date</th><th>Pages scanned</th><th>Good pages</th><th>Bad pages</th><th>Quality</th><th>Downtime</th><th>Status</th></tr></thead><tbody>{records.map((r) => <tr key={r.date}><td><b>{r.day}</b><span>{r.date}</span></td><td>{r.scanned.toLocaleString()}</td><td>{r.good.toLocaleString()}</td><td>{r.bad}</td><td><b className="quality-cell">{r.quality}%</b></td><td>{r.downtime} min</td><td><span className="status">On track</span></td></tr>)}</tbody></table></div>
        </section>
      </section>
      <footer><span>Pulse Performance Portal</span><span>Metrics are updated throughout your shift.</span><button>Need help?</button></footer>
    </main>
  );
}
