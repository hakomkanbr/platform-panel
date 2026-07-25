export const globalStyles = `
/* ===== Share2Sells Design System ===== */

/* Inter Font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ===== CSS Custom Properties ===== */
:root {
  --s2s-orange: #F7931E;
  --s2s-orange-light: #FFF3E0;
  --s2s-orange-dark: #E67E00;
  --s2s-blue: #009FE3;
  --s2s-blue-light: #E3F2FD;
  --s2s-blue-dark: #007BB5;
  --s2s-green: #10B981;
  --s2s-red: #EF4444;
  --s2s-yellow: #F59E0B;
  --s2s-purple: #8B5CF6;

  --s2s-bg-app: #FAFBFC;
  --s2s-bg-layout: #FAFBFC;
  --s2s-bg-container: #FFFFFF;
  --s2s-bg-sidebar: #FFFFFF;
  --s2s-bg-card: #FFFFFF;
  --s2s-bg-subtle: #F3F4F6;
  --s2s-bg-hover: #F9FAFB;

  --s2s-text-primary: #1F2937;
  --s2s-text-secondary: #6B7280;
  --s2s-text-tertiary: #9CA3AF;
  --s2s-text-inverse: #FFFFFF;

  --s2s-border: #E5E7EB;
  --s2s-border-light: #F3F4F6;
  --s2s-border-focus: #F7931E;

  --s2s-radius-sm: 6px;
  --s2s-radius-md: 8px;
  --s2s-radius-lg: 12px;
  --s2s-radius-xl: 16px;

  --s2s-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --s2s-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.04);
  --s2s-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.04);
  --s2s-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.04);

  --s2s-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --s2s-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

/* ===== Global Resets & Base ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--s2s-font-family);
  background: var(--s2s-bg-app);
  color: var(--s2s-text-primary);
  line-height: 1.5;
}

/* ===== Modern Layout Overrides ===== */
.modern-layout {
  min-height: 100vh;
}

.modern-layout .ant-layout {
  background: var(--s2s-bg-layout);
}

.modern-layout .ant-layout-sider {
  background: var(--s2s-bg-sidebar) !important;
  border-right: 1px solid var(--s2s-border);
  position: fixed !important;
  left: 0;
  overflow:auto!important;
  top: 0;
  bottom: 0;
  z-index: 100;
  height: 100vh;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-layout .ant-layout-sider-children {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modern-layout .ant-layout-header {
  position: sticky;
  top: 0;
  z-index: 99;
  padding: 0 24px !important;
  background: var(--s2s-bg-container) !important;
  border-bottom: 1px solid var(--s2s-border);
  height: 64px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(12px);
}

.modern-layout .ant-layout-content {
  padding: 0 !important;
  background: transparent !important;
}

.modern-layout .ant-menu {
  border: none !important;
  background: transparent !important;
}

.modern-layout .ant-menu-item {
  margin: 4px 10px !important;
  border-radius: 10px !important;
  padding: 0 20px !important;
  height: 44px !important;
  line-height: 44px !important;
  display: flex !important;
  align-items: center !important;
  font-weight: 500;
  transition: all 0.2s ease;
}

.modern-layout .ant-menu-item-selected {
  background: var(--s2s-orange-light) !important;
  color: var(--s2s-orange) !important;
  font-weight: 600;
}

.modern-layout .ant-menu-item-selected .ant-menu-item-icon {
  color: var(--s2s-orange) !important;
}

.modern-layout .ant-menu-item:hover {
  background: var(--s2s-bg-hover) !important;
  color: var(--s2s-orange) !important;
}

.modern-layout .ant-menu-submenu-title {
  margin: 4px 10px !important;
  border-radius: 10px !important;
  height: 44px !important;
  line-height: 44px !important;
  font-weight: 500;
}

.modern-layout .ant-menu-submenu-title:hover {
  background: var(--s2s-bg-hover) !important;
  color: var(--s2s-orange) !important;
}

.modern-layout .ant-menu-submenu-selected > .ant-menu-submenu-title {
  color: var(--s2s-orange) !important;
}

.modern-layout .ant-menu-inline .ant-menu-sub {
  background: transparent !important;
}

.modern-layout .ant-menu-item-divider {
  border-color: var(--s2s-border);
}

/* ===== Sidebar Floating Effect ===== */
.s2s-sidebar-floating {
  margin: 12px !important;
  border-radius: var(--s2s-radius-xl) !important;
  box-shadow: var(--s2s-shadow-md) !important;
  border: 1px solid var(--s2s-border) !important;
  height: calc(100vh - 24px) !important;
}

/* ===== Card Styles ===== */
.s2s-card {
  background: var(--s2s-bg-card);
  border-radius: var(--s2s-radius-xl);
  border: 1px solid var(--s2s-border);
  padding: 24px;
  transition: box-shadow 0.2s ease;
}

.s2s-card:hover {
  box-shadow: var(--s2s-shadow-md);
}

/* ===== Page Header ===== */
.s2s-page-header {
  margin-bottom: 24px;
}

.s2s-page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--s2s-text-primary);
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.s2s-page-header p {
  font-size: 15px;
  color: var(--s2s-text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ===== KPI Card ===== */
.s2s-kpi-card {
  background: var(--s2s-bg-card);
  border-radius: var(--s2s-radius-xl);
  border: 1px solid var(--s2s-border);
  padding: 24px;
  transition: all 0.2s ease;
}

.s2s-kpi-card:hover {
  box-shadow: var(--s2s-shadow-md);
}

.s2s-kpi-card .kpi-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--s2s-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.s2s-kpi-card .kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--s2s-text-primary);
  line-height: 1.1;
  margin-bottom: 4px;
}

.s2s-kpi-card .kpi-trend {
  font-size: 13px;
  font-weight: 500;
}

.s2s-kpi-card .kpi-trend.up { color: var(--s2s-green); }
.s2s-kpi-card .kpi-trend.down { color: var(--s2s-red); }

/* ===== Empty State ===== */
.s2s-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.s2s-empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--s2s-text-primary);
  margin: 16px 0 8px;
}

.s2s-empty-state p {
  font-size: 14px;
  color: var(--s2s-text-secondary);
  margin: 0;
  max-width: 320px;
}

/* ===== Status Badges ===== */
.s2s-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
}

.s2s-badge.active {
  background: #D1FAE5;
  color: #065F46;
}

.s2s-badge.pending {
  background: #FEF3C7;
  color: #92400E;
}

.s2s-badge.inactive {
  background: #FEE2E2;
  color: #991B1B;
}

.s2s-badge.draft {
  background: #F3F4F6;
  color: #6B7280;
}

.s2s-badge.info {
  background: #E3F2FD;
  color: #1E40AF;
}

/* ===== Scrollbar ===== */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

/* ===== Animations ===== */
@keyframes s2s-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes s2s-slide-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes s2s-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.s2s-animate-fade {
  animation: s2s-fade-in 0.2s ease;
}

.s2s-animate-slide {
  animation: s2s-slide-up 0.3s ease;
}

.s2s-animate-scale {
  animation: s2s-scale-in 0.2s ease;
}

/* ===== Stagger animation for children ===== */
.s2s-stagger > * {
  animation: s2s-slide-up 0.3s ease both;
}

.s2s-stagger > *:nth-child(1) { animation-delay: 0.02s; }
.s2s-stagger > *:nth-child(2) { animation-delay: 0.04s; }
.s2s-stagger > *:nth-child(3) { animation-delay: 0.06s; }
.s2s-stagger > *:nth-child(4) { animation-delay: 0.08s; }
.s2s-stagger > *:nth-child(5) { animation-delay: 0.10s; }
.s2s-stagger > *:nth-child(6) { animation-delay: 0.12s; }
.s2s-stagger > *:nth-child(7) { animation-delay: 0.14s; }
.s2s-stagger > *:nth-child(8) { animation-delay: 0.16s; }

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .modern-layout .ant-layout-content {
    margin: 0 !important;
  }

  .modern-layout .ant-layout-header {
    padding: 0 16px !important;
  }

  .s2s-page-header h1 {
    font-size: 24px;
  }

  .s2s-kpi-card .kpi-value {
    font-size: 28px;
  }

  .s2s-card {
    padding: 16px;
  }
}

/* ===== Mobile Overlay ===== */
.s2s-mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  animation: s2s-fade-in 0.2s ease;
}
`;
