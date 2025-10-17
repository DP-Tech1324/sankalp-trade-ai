import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/Settings"
import ImportWizard from "./pages/ImportWizard"
import AiChatBubble from "./components/AiChatBubble"
import { TradeProvider } from "./context/TradeContext"
import "./styles.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TradeProvider>
      <BrowserRouter>
        <AiChatBubble />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/import" element={<ImportWizard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </TradeProvider>
  </React.StrictMode>
)
