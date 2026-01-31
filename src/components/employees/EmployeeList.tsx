import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Flex,
  Grid,
  Tooltip,
  Dropdown,
  Form,
  Select,
  notification,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  StopOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { Employee } from "../../types";
import { api } from "../../services/api";
import { EmployeeForm } from "./EmployeeForm";
import Title from "antd/es/typography/Title";
import { useEmployeesData } from "../../hooks/useEmployeesData";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
const { useBreakpoint } = Grid;
const { Option } = Select;

export const EmployeeList: React.FC = () => {
  const { employees, loading, refetch: refetchEmployees } = useEmployeesData();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const navigate = useNavigate();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [search, setSearch] = useState("");

  const [form] = Form.useForm();

  const handleCreate = () => {
    setSelectedEmployee(null);
    setModalVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Deactivate Employee",
      content: "Are you sure you want to deactivate this employee?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const employee = await api.updateEmployee(id, { status: "inactive" });
          notification.success({
            title: `Employee ${employee.firstName} ${employee.lastName} deactivated`,
          });
          refetchEmployees();
        } catch (error) {
          console.log(error);
          const message =
            error instanceof Error ? error.message : "Something went wrong";
          notification.error({
            title: `Failed to deactivate employee`,
            description: message,
          });
        }
      },
    });
  };

  const handleFormSubmit = async (
    values: Omit<Employee, "id" | "createdAt">,
  ) => {
    try {
      if (selectedEmployee) {
        const employee = await api.updateEmployee(selectedEmployee.id, values);
        notification.success({
          title: `Employee ${employee.firstName} ${employee.lastName} updated successfully`,
        });
      } else {
        const employee = await api.createEmployee(values);
        notification.success({
          title: `Employee ${employee.firstName} ${employee.lastName} created successfully`,
        });
      }
      setModalVisible(false);
      refetchEmployees();
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notification.error({
        title: `Operation failed`,
        description: message,
      });
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const employeeName = employee
      ? `${employee.firstName} ${employee.lastName}`.toLowerCase()
      : "";

    const matchesStatus =
      selectedStatus === "all" || employee?.status === selectedStatus;

    const matchesSearch =
      !search || employeeName.includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (record: Employee) => `${record.firstName} ${record.lastName}`,
      sorter: (a: Employee, b: Employee) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Employee) => {
        const isActive = record.status === "active";
        return (
          <Space>
            <Tooltip title="View dashboard">
              <Button
                icon={<EyeOutlined />}
                onClick={() => navigate(`/employees/${record.id}/dashboard`)}
                size="middle"
              />
            </Tooltip>
            <Tooltip title="Edit employee">
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                size="middle"
              />
            </Tooltip>
            <Tooltip
              title={
                isActive ? "Deactivate employee" : "Employee already inactive"
              }
            >
              <Button
                icon={<StopOutlined />}
                onClick={() => handleDelete(record.id)}
                danger
                size="middle"
                disabled={!isActive}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Title level={2}>Employees</Title>
      <Flex
        justify="space-between"
        align={isMobile ? "stretch" : "center"}
        vertical={isMobile}
        gap={isMobile ? 12 : 0}
        style={{ marginBottom: 16 }}
      >
        {/* LEFT SIDE: Search + Filter */}
        <Flex gap={8} vertical={isMobile}>
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ flex: 1, minWidth: 220 }}
          />

          <Dropdown
            styles={{
              root: {
                background: "#fff",
                boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                borderRadius: 8,
              },
            }}
            trigger={["click"]}
            popupRender={() => (
              <div style={{ padding: 12, minWidth: 260 }}>
                <Form form={form} layout="vertical">
                  <Form.Item label="Employee Status">
                    <Select
                      placeholder="Filter by status"
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                    >
                      <Option value="all">All</Option>
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                    </Select>
                  </Form.Item>

                  <Button
                    block
                    onClick={() => {
                      setSelectedStatus("all");
                      form.resetFields();
                    }}
                  >
                    Reset Filters
                  </Button>
                </Form>
              </div>
            )}
          >
            <Button block={isMobile} icon={<FilterOutlined />}>
              Filter
            </Button>
          </Dropdown>
        </Flex>

        {/* RIGHT SIDE: Create */}
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Employee
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={selectedEmployee ? "Edit Employee" : "Add Employee"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnHidden
        style={{ top: 24 }}
      >
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </>
  );
};
