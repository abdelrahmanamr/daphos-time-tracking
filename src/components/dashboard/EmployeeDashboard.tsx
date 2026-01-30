import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Button,
  Tooltip,
  Empty,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import { useEmployeeDashboard } from "../../hooks/useEmployeeDashboard";
import { Spinner } from "../Spinner";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;

export const EmployeeDashboard: React.FC = () => {
  const { id: employeeId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { dashboardData, loading: dashboardDataLoading } =
    useEmployeeDashboard(employeeId);

  if (dashboardDataLoading) {
    return <Spinner />;
  }

  if (!dashboardData) {
    return (
      <Card style={{ marginTop: 48, textAlign: "center" }}>
        <Empty description="No dashboard data found for this employee" />
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={() => navigate("/employees")}
        >
          Back to Employees
        </Button>
      </Card>
    );
  }

  const shiftColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Break Hours",
      dataIndex: "breakHours",
      key: "breakHours",
      render: (hours: number) => `${hours}h`,
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Tooltip title={"Back"}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/employees")}
            size="large"
          />
        </Tooltip>

        <UserOutlined style={{ fontSize: 48, color: "#2f5fb3" }} />
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {dashboardData.employee.firstName} {dashboardData.employee.lastName}
          </Title>
          <div style={{ fontSize: 16, color: "rgba(0,0,0,0.45)" }}>
            {dashboardData.employee.role}
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Shifts"
              value={dashboardData.stats.totalShifts}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Hours Worked"
              value={dashboardData.stats.totalWorkingHours.toFixed(1)}
              suffix="h"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Break Hours"
              value={dashboardData.stats.totalBreakHours.toFixed(1)}
              suffix="h"
              prefix={<CoffeeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Shift Length"
              value={dashboardData.stats.averageWorkLength.toFixed(1)}
              suffix="h"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Shifts">
        <Table
          columns={shiftColumns}
          dataSource={dashboardData.recentShifts}
          rowKey="id"
          pagination={false}
          scroll={{ x: "max-content" }} // ✅ mobile scroll
        />
      </Card>
    </div>
  );
};
