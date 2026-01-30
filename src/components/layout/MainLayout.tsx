import React, { useState } from "react";
import {
  Layout,
  Menu,
  Flex,
  Tooltip,
  Avatar,
  Typography,
  Grid,
  Button,
  Drawer,
  Breadcrumb,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  MenuOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const userName = "Abd. Salem";
  const userRole = "Sr. Full-Stack";

  const menuItems = (
    <Menu
      selectedKeys={[location.pathname.split("/")[1] || "employees"]}
      mode="inline"
      onClick={({ key }) => {
        navigate(`/${key}`);
        if (isMobile) setDrawerVisible(false);
      }}
      style={{ background: "#20487b" }}
      theme="dark"
      items={[
        { key: "employees", icon: <TeamOutlined />, label: "Employees" },
        { key: "shifts", icon: <ClockCircleOutlined />, label: "Shifts" },
      ]}
    />
  );

  const avatarSection = (
    <Flex
      align="center"
      justify={collapsed || isMobile ? "center" : "flex-start"}
      style={{
        padding: 16,
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        borderRight: "1px solid rgba(255,255,255,0.15)",
        height: 65,
      }}
    >
      <Tooltip title={collapsed ? userName : ""} placement="right">
        <Avatar
          size={40}
          icon={<UserOutlined />}
          style={{ background: "#2f5fb3" }}
        />
      </Tooltip>

      {!collapsed && (
        <div style={{ marginLeft: 12 }}>
          <Text style={{ color: "#fff", display: "block" }}>{userName}</Text>
          <Text type="secondary" style={{ color: "#fff", fontSize: 12 }}>
            {userRole}
          </Text>
        </div>
      )}
    </Flex>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sider */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
        >
          {avatarSection}
          {menuItems}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{
            body: { padding: 0 },
          }}
          size={200}
          style={{ background: "#20487b" }}
          closeIcon={<CloseCircleFilled />}
          closable={{ placement: "end" }}
        >
          {avatarSection}
          {menuItems}
        </Drawer>
      )}

      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: "0 16px",
            background: "#20487b",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: "#fff" }} />}
              onClick={() => setDrawerVisible(true)}
              style={{
                position: "absolute",
                left: 16,
              }}
            />
          )}
          <img
            src="/images/logo.png"
            alt="Company Logo"
            style={{ height: 50 }}
          />
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "DaphOS" }, { title: "Time Tracking" }]}
          />
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
