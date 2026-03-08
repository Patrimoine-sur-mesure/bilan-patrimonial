import FormulaireBudgetPatrimonial from "./FormulaireBudgetPatrimonial";
import Admin from "./Admin";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<FormulaireBudgetPatrimonial />} />

        <Route path="/admin" element={<Admin />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;