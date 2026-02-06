import React, { useEffect, useRef, useState } from "react";
import { Xiangqiground } from "xiangqiground";
import "../node_modules/xiangqiground/assets/xiangqiground.base.css";
import "../node_modules/xiangqiground/assets/xiangqiground.board.css";
import "../node_modules/xiangqiground/assets/xiangqiground.pieces.css";
import { Layout, Card, Button, Typography, Space, Tag, message } from "antd";
import { ReloadOutlined, RobotOutlined } from "@ant-design/icons";
import { DARK_CHESS_START_FEN } from "./utils/darkChessLogic";

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [status, setStatus] = useState("Lượt của bạn");
  const workerRef = useRef<Worker | null>(null);
  const groundRef = useRef<any>(null);

  // Lưu trữ bảng map quân cờ hiện tại (để biết ô nào đã mở, ô nào chưa)
  const piecesMap = useRef<Record<string, string>>({
    ...require("./utils/darkChessLogic").INITIAL_REAL_PIECES,
  });

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./engine.worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (e) => {
      const bestMove = e.data;
      if (bestMove && groundRef.current) {
        // AI đi: lật quân nếu AI đi vào quân úp
        handleReveal(bestMove.from, bestMove.to);
        groundRef.current.move(bestMove.from, bestMove.to);
        setStatus("Lượt của bạn");
      }
    };

    return () => workerRef.current?.terminate();
  }, []);

  const handleReveal = (from: string, to: string) => {
    // Nếu vị trí 'from' vẫn còn trong map quân úp, ta lấy quân thật ra
    const realPiece = piecesMap.current[from];
    if (realPiece) {
      // Cập nhật lên bàn cờ quân thật thay vì quân úp
      groundRef.current.set({
        pieces: {
          [to]: {
            role: realPiece.toLowerCase(),
            color: realPiece === realPiece.toUpperCase() ? "white" : "black",
          },
        },
      });
      // Xóa khỏi danh sách quân ẩn vì đã lật
      delete piecesMap.current[from];
    }
  };

  const onMove = (from: string, to: string) => {
    if (status === "Máy đang nghĩ...") return;

    // 1. Xử lý lật quân cho người chơi
    handleReveal(from, to);

    // 2. Gửi FEN đã cập nhật cho AI
    setStatus("Máy đang nghĩ...");
    setTimeout(() => {
      const currentFen = groundRef.current.getFen();
      workerRef.current?.postMessage({ fen: currentFen });
    }, 200);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header style={{ background: "#001529", padding: "0 20px" }}>
        <Title level={3} style={{ color: "white", margin: "15px 0" }}>
          SOFT AI - Cờ Úp Pro
        </Title>
      </Header>

      <Content
        style={{ padding: "40px", display: "flex", justifyContent: "center" }}
      >
        <Space direction="horizontal" align="start" size={32}>
          <Card shadow-sm>
            <div
              id="ground-container"
              style={{ width: "450px", height: "500px" }}
            >
              <div
                ref={(el) => {
                  if (el && !groundRef.current) {
                    groundRef.current = Xiangqiground(el, {
                      fen: DARK_CHESS_START_FEN,
                      movable: { color: "white", free: true },
                      events: { move: onMove },
                      animation: { enabled: true, duration: 200 },
                    });
                  }
                }}
              />
            </div>
          </Card>

          <Space direction="vertical" style={{ width: "300px" }}>
            <Card title="Điều khiển">
              <Tag
                color={status.includes("Máy") ? "volcano" : "green"}
                style={{ marginBottom: 16 }}
              >
                {status}
              </Tag>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  block
                  onClick={() => window.location.reload()}
                >
                  Ván mới
                </Button>
                <Button
                  icon={<RobotOutlined />}
                  block
                  onClick={() => message.info("Tính năng đang phát triển")}
                >
                  Gợi ý
                </Button>
              </Space>
            </Card>
          </Space>
        </Space>
      </Content>
    </Layout>
  );
};

export default App;
