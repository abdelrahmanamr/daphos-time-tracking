import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Space,
} from "antd";
import dayjs from "dayjs";
import type { Shift, Employee } from "../../types";

const { Option } = Select;
const { TextArea } = Input;

interface ShiftFormProps {
  shift?: Shift | null;
  employees: Employee[];
  onSubmit: (values: Omit<Shift, "id">) => void;
  onCancel: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({
  shift,
  employees,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (shift) {
      form.setFieldsValue({
        ...shift,
        date: dayjs(shift.date),
      });
    } else {
      form.resetFields();
    }
  }, [shift, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        date: values.date.toDate(),
      };
      onSubmit(formattedValues);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="employeeId"
        label="Employee"
        rules={[{ required: true, message: "Please select an employee" }]}
      >
        <Select placeholder="Select employee">
          {employees
            .filter((e) => e.status === "active")
            .map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="startTime"
        label="Start Time"
        rules={[{ required: true, message: "Please enter start time" }]}
      >
        <Input type="time" />
      </Form.Item>
      <Form.Item
        name="endTime"
        label="End Time"
        rules={[{ required: true, message: "Please enter end time" }]}
      >
        <Input type="time" />
      </Form.Item>
      <Form.Item
        name="breakHours"
        label="Break Hours"
        initialValue={0}
        rules={[
          { required: true, message: "Please enter break hours" },
          { type: "number", min: 0, message: "Break hours must be positive" },
        ]}
      >
        <InputNumber min={0} max={24} step={0.5} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="notes" label="Notes">
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item>
        <Space style={{ float: "right" }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            {shift ? "Update" : "Create"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
