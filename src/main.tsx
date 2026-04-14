import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

type RootErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class RootErrorBoundary extends React.Component<React.PropsWithChildren, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): RootErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unknown render error",
    };
  }

  componentDidCatch(error: unknown) {
    console.error("Root render failed", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1f1f1f",
            color: "#f5f5f5",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: "24px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              border: "1px solid #3d3d3d",
              borderRadius: "16px",
              background: "#242424",
              padding: "24px",
            }}
          >
<<<<<<< HEAD
            <h1 style={{ fontSize: "20px", marginBottom: "12px" }}>Gallery Cache 启动失败</h1>
=======
            <h1 style={{ fontSize: "20px", marginBottom: "12px" }}>idealib 启动失败</h1>
>>>>>>> 57eddd3 (Initial commit)
            <p style={{ color: "#cfcfcf", lineHeight: 1.6 }}>
              应用已经捕获到前端渲染错误，至少不会再只显示黑屏。
            </p>
            <pre
              style={{
                marginTop: "16px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#ffb4b4",
                fontSize: "12px",
              }}
            >
              {this.state.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
);
