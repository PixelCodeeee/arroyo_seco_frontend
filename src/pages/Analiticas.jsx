import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/Analiticas.css";

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem("token");

async function fetchAuth(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

/* ── Iconos SVG ── */
const Icons = {
  chart: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  money: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3H15" />
    </svg>
  ),
  cart: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  calendar: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  users: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  package: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  fork: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 11v11M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3h18v3z" />
    </svg>
  ),
  user: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  trend: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

/* ── Dona SVG ── */
function Donut({ data, total }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="donut-section">
      <div className="donut-wrap">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {data.map((item, i) => {
            const pct = total > 0 ? item.value / total : 0;
            const dash = pct * circ;
            const gap = circ - dash;
            const el = (
              <circle key={i} cx="60" cy="60" r={r} fill="none"
                stroke={item.color} strokeWidth="14"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset} />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="donut-center">
          <span className="donut-total">{total}</span>
          <span className="donut-sub">total</span>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((item, i) => (
          <div className="legend-item-an" key={i}>
            <span className="legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
            <span className="legend-count">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Principal ── */
function Analiticas() {
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [pedidosStats, setPedidosStats] = useState(null);
  const [reservasStats, setReservasStats] = useState(null);
  const [usuariosStats, setUsuariosStats] = useState(null);
  const [topProductos, setTopProductos] = useState([]);
  const [topServicios, setTopServicios] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ped, res, usr, prods, servs] = await Promise.all([
          fetchAuth(`${API_URL}/pedidos/analiticas/stats`),
          fetchAuth(`${API_URL}/reservas/analiticas/stats`),
          fetchAuth(`${API_URL}/usuarios/analiticas/stats`),
          fetch(`${API_URL}/pedidos/recomendaciones/top-productos?limit=5`).then(r => r.json()),
          fetch(`${API_URL}/reservas/recomendaciones/top-servicios?limit=5`).then(r => r.json()),
        ]);
        setPedidosStats(ped);
        setReservasStats(res);
        setUsuariosStats(usr);
        setTopProductos(prods.productos || []);
        setTopServicios(servs.servicios || []);
      } catch  {
        setError("No se pudieron cargar las analíticas. Verifica tu sesión.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getRankClass = (i) => {
    if (i === 0) return "gold";
    if (i === 1) return "silver";
    if (i === 2) return "bronze";
    return "normal";
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount || 0);

  if (loading) {
    return (
      <Layout>
        <div className="analiticas-loading">
          <div className="analiticas-spinner" />
          <p>Cargando analíticas...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="analiticas-loading">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  const pedidosDonut = [
    { label: "Pendientes",  value: pedidosStats?.pendientes  || 0, color: "#FFC107" },
    { label: "Pagados",     value: pedidosStats?.pagados     || 0, color: "#4CAF50" },
    { label: "Enviados",    value: pedidosStats?.enviados    || 0, color: "#2196F3" },
    { label: "Completados", value: pedidosStats?.completados || 0, color: "#e3008c" },
  ];
  const totalPedidosDonut = pedidosDonut.reduce((a, b) => a + b.value, 0);

  const reservasDonut = [
    { label: "Pendientes",  value: reservasStats?.pendientes  || 0, color: "#FFC107" },
    { label: "Confirmadas", value: reservasStats?.confirmadas || 0, color: "#4CAF50" },
    { label: "Canceladas",  value: reservasStats?.canceladas  || 0, color: "#f44336" },
  ];
  const totalReservasDonut = reservasDonut.reduce((a, b) => a + b.value, 0);

  const maxRegistros  = Math.max(...(usuariosStats?.registrosPorMes?.map(m => m.total) || [1]));
  const maxReservasMes = Math.max(...(reservasStats?.reservasPorMes?.map(m => m.total_reservas) || [1]));
  const maxVentasMes  = Math.max(...(pedidosStats?.ventasPorMes?.map(m => m.ingresos || 1) || [1]));
  const maxUsuarios   = Math.max(
    usuariosStats?.stats?.turistas  || 1,
    usuariosStats?.stats?.oferentes || 1,
    usuariosStats?.stats?.admins    || 1
  );

  return (
    <Layout>
      <div className="analiticas-container">

        {/* HEADER */}
        <header className="analiticas-header">
          <div className="header-content">
            <div className="header-info">
              <h1>{Icons.chart} Analíticas</h1>
              <p className="welcome-text">Resumen general del desempeño de Arroyo Seco</p>
              <span className="analiticas-period">Últimos 30 días</span>
            </div>
          </div>
        </header>

        {/* KPIs */}
        <div className="analiticas-stats">
          <div className="stat-card-an">
            <div className="stat-icon-an">{Icons.money}</div>
            <div className="stat-value-an">{formatCurrency(pedidosStats?.ingresos_totales)}</div>
            <div className="stat-label-an">Ingresos totales</div>
          </div>
          <div className="stat-card-an">
            <div className="stat-icon-an">{Icons.cart}</div>
            <div className="stat-value-an">{pedidosStats?.total_pedidos || 0}</div>
            <div className="stat-label-an">Pedidos este mes</div>
          </div>
          <div className="stat-card-an">
            <div className="stat-icon-an">{Icons.calendar}</div>
            <div className="stat-value-an">{reservasStats?.total_reservas || 0}</div>
            <div className="stat-label-an">Reservas este mes</div>
          </div>
          <div className="stat-card-an">
            <div className="stat-icon-an">{Icons.users}</div>
            <div className="stat-value-an">{usuariosStats?.stats?.total_usuarios || 0}</div>
            <div className="stat-label-an">Usuarios registrados</div>
          </div>
        </div>

        {/* GRÁFICAS */}
        <div className="analiticas-charts">

          <div className="chart-card-an">
            <div className="section-title">{Icons.cart} Estado de Pedidos</div>
            <Donut data={pedidosDonut} total={totalPedidosDonut} />
          </div>

          <div className="chart-card-an">
            <div className="section-title">{Icons.calendar} Estado de Reservas</div>
            <Donut data={reservasDonut} total={totalReservasDonut} />
          </div>

          <div className="chart-card-an">
            <div className="section-title">{Icons.users} Nuevos Usuarios por Mes</div>
            <div className="mes-chart">
              {usuariosStats?.registrosPorMes?.length > 0 ? (
                usuariosStats.registrosPorMes.map((m, i) => (
                  <div className="mes-bar-wrap" key={i}>
                    <span className="mes-value">{m.total}</span>
                    <div className="mes-bar purple"
                      style={{ height: `${(m.total / maxRegistros) * 80}px` }} />
                    <span className="mes-label">{m.mes_label?.split(" ")[0]}</span>
                  </div>
                ))
              ) : <p className="sin-datos">Sin datos aún</p>}
            </div>
          </div>

          <div className="chart-card-an">
            <div className="section-title">{Icons.money} Ventas por Mes</div>
            <div className="mes-chart">
              {pedidosStats?.ventasPorMes?.length > 0 ? (
                pedidosStats.ventasPorMes.map((m, i) => (
                  <div className="mes-bar-wrap" key={i}>
                    <span className="mes-value">
                      ${Number(m.ingresos || 0).toLocaleString("es-MX", { notation: "compact" })}
                    </span>
                    <div className="mes-bar"
                      style={{ height: `${(m.ingresos / maxVentasMes) * 80}px` }} />
                    <span className="mes-label">{m.mes_label?.split(" ")[0]}</span>
                  </div>
                ))
              ) : <p className="sin-datos">Sin datos aún</p>}
            </div>
          </div>

        </div>

        {/* TOPS */}
        <div className="analiticas-tops">

          <div className="top-card-an">
            <div className="section-title">{Icons.package} Top Productos Más Vendidos</div>
            <div className="top-list-an">
              {topProductos.length > 0 ? topProductos.map((p, i) => (
                <div className="top-item-an" key={p.id_producto}>
                  <div className={`top-rank-an ${getRankClass(i)}`}>{i + 1}</div>
                  <div className="top-info-an">
                    <div className="top-name-an">{p.nombre_producto}</div>
                    <div className="top-sub-an">{p.nombre_negocio}</div>
                  </div>
                  <div className="top-stat-an">{p.total_vendido} uds.</div>
                </div>
              )) : <p className="sin-datos">Sin datos aún</p>}
            </div>
          </div>

          <div className="top-card-an">
            <div className="section-title">{Icons.fork} Top Servicios Más Reservados</div>
            <div className="top-list-an">
              {topServicios.length > 0 ? topServicios.map((s, i) => (
                <div className="top-item-an" key={s.id_servicio}>
                  <div className={`top-rank-an ${getRankClass(i)}`}>{i + 1}</div>
                  <div className="top-info-an">
                    <div className="top-name-an">{s.nombre_servicio}</div>
                    <div className="top-sub-an">{s.nombre_negocio}</div>
                  </div>
                  <div className="top-stat-an">{s.total_reservas} reservas</div>
                </div>
              )) : <p className="sin-datos">Sin datos aún</p>}
            </div>
          </div>

          <div className="top-card-an">
            <div className="section-title">{Icons.user} Distribución de Usuarios</div>
            <div className="bar-chart-an">
              {[
                { label: "Turistas",  value: usuariosStats?.stats?.turistas  || 0 },
                { label: "Oferentes", value: usuariosStats?.stats?.oferentes || 0 },
                { label: "Admins",    value: usuariosStats?.stats?.admins    || 0 },
                { label: "Activos",   value: usuariosStats?.stats?.activos   || 0 },
              ].map((item, i) => (
                <div className="bar-item-an" key={i}>
                  <span className="bar-label-an">{item.label}</span>
                  <div className="bar-track-an">
                    <div className="bar-fill-an"
                      style={{ width: `${(item.value / maxUsuarios) * 100}%` }} />
                  </div>
                  <span className="bar-value-an">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="top-card-an">
            <div className="section-title">{Icons.trend} Reservas por Mes</div>
            <div className="mes-chart">
              {reservasStats?.reservasPorMes?.length > 0 ? (
                reservasStats.reservasPorMes.map((m, i) => (
                  <div className="mes-bar-wrap" key={i}>
                    <span className="mes-value" style={{ color: "#FFC107" }}>{m.total_reservas}</span>
                    <div className="mes-bar amber"
                      style={{ height: `${(m.total_reservas / maxReservasMes) * 80}px` }} />
                    <span className="mes-label">{m.mes_label?.split(" ")[0]}</span>
                  </div>
                ))
              ) : <p className="sin-datos">Sin datos aún</p>}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Analiticas;