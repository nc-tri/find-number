import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import MainPage from "./pages/MainPage";
import Layout from "./pages/Layout";
import { EffectContextProvider } from "./components/EffectContext";
import CalculatePage from "./pages/CalculatePage";

function App() {
  return (
    <EffectContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/calculate" element={<CalculatePage />} />
        </Route>
      </Routes>
    </EffectContextProvider>
  );
}

export default App;
