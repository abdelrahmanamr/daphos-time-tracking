import { Spin } from "antd";

export const Spinner: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",
      }}
    >
      <Spin size="large" />
    </div>
  );
};
