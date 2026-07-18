export const globalStyles = `
.modern-layout .ant-layout-sider-children {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modern-layout .ant-menu {
  border: none !important;
  background: transparent !important;
}

.modern-layout .ant-menu-item {
  margin: 4px 8px !important;
  border-radius: 8px !important;
  height: 48px !important;
  line-height: 48px !important;
  display: flex !important;
  align-items: center !important;
}

.modern-layout .ant-menu-item-selected {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  color: white !important;
}

.modern-layout .ant-menu-item-selected .ant-menu-item-icon {
  color: white !important;
}

.modern-layout .ant-menu-item:hover {
  background: #f1f5f9 !important;
  color: #6366f1 !important;
}

.modern-layout .ant-menu-submenu-title {
  margin: 4px 8px !important;
  border-radius: 8px !important;
  height: 48px !important;
  line-height: 48px !important;
}

.modern-layout .ant-menu-submenu-title:hover {
  background: #f1f5f9 !important;
  color: #6366f1 !important;
}

.modern-layout .ant-layout-header {
  padding: 0 24px !important;
  background: white !important;
  border-bottom: 1px solid #e2e8f0 !important;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
}

.modern-layout .ant-layout-content {
  margin: 24px !important;
  padding: 0 !important;
  background: transparent !important;
}

@media (max-width: 768px) {
  .modern-layout .ant-layout-content {
    margin: 16px !important;
  }
}
`;
