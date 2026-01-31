import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Select,
  Dropdown,
  Flex,
  Grid,
  Form,
  Tooltip,
  notification,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { Shift } from "../../types";
import { api } from "../../services/api";
import { ShiftForm } from "./ShiftForm";
import Title from "antd/es/typography/Title";
import { useShiftData } from "../../hooks/useShiftData";
import { useEmployeesData } from "../../hooks/useEmployeesData";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
// import Title from "antd/es/typography/Title";

const { Option } = Select;
const { useBreakpoint } = Grid;

export const ShiftList: React.FC = () => {
  const {
    shifts,
    loading: shiftsLaoding,
    refetch: refetchShifts,
  } = useShiftData();
  const { employees } = useEmployeesData();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [search, setSearch] = useState("");

  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleCreate = () => {
    setSelectedShift(null);
    setModalVisible(true);
  };

  const handleEdit = (shift: Shift) => {
    setSelectedShift(shift);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Delete Shift",
      content: "Are you sure you want to delete this shift?",
      onOk: async () => {
        try {
          await api.deleteShift(id);
          message.success("Shift deleted");
          refetchShifts();
        } catch (error) {
          console.log(error);
          message.error("Failed to delete shift");
        }
      },
    });
  };

  const handleFormSubmit = async (values: Omit<Shift, "id">) => {
    try {
      if (selectedShift) {
        await api.updateShift(selectedShift.id, values);
        notification.success({
          title: `Shift updated successfully`,
        });
      } else {
        await api.createShift(values);
        notification.success({
          title: `Shift created successfully`,
        });
      }
      setModalVisible(false);
      refetchShifts();
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notification.error({
        title: `Shift created successfully`,
        description: message,
      });
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    const employee = employees.find((e) => e.id === shift.employeeId);
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
      title: "Employee",
      key: "employee",
      render: (record: Shift) => {
        const employee = employees.find((e) => e.id === record.employeeId);
        return employee
          ? `${employee.firstName} ${employee.lastName}`
          : "Unknown";
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: Date) => dayjs(date).format("YYYY-MM-DD"),
      sorter: (a: Shift, b: Shift) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
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
    {
      title: "Actions",
      key: "actions",
      render: (record: Shift) => (
        <Space>
          <Tooltip title="Edit shift">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="middle"
            />
          </Tooltip>
          <Tooltip title="Delete shift">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              danger
              size="middle"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Shifts</Title>
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
            placeholder="Search by employee"
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
              <div style={{ padding: 8, minWidth: 260 }}>
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
          Add Shift
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={filteredShifts}
        rowKey="id"
        loading={shiftsLaoding}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={selectedShift ? "Edit Shift" : "Add Shift"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnHidden
        style={{ top: 24 }}
      >
        <ShiftForm
          shift={selectedShift}
          employees={employees}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </>
  );
};
