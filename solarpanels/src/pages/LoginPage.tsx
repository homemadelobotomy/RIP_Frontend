import { useState } from "react";
import { Form,  Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loginUser } from "../slices/authSlice";
import Layout from "../components/Layout";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await dispatch(loginUser({ login, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/panels");
    } else {
      setError("Ошибка авторизации");
    }
  };

  return (
    <Layout>
      <div className="filter-section" style={{ flexDirection: "column", maxWidth: 400, margin: "80px auto 0" }}>
        <h2 style={{ color: "#666", fontFamily: "'Noto Sans', Arial, sans-serif", textAlign: "center", marginBottom: "2rem" }}>
          Вход
        </h2>
        {error && <Alert variant="danger" className="w-100 mb-2">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="w-100" autoComplete="off">
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              value={login}
              autoComplete="username"
              onChange={e => setLogin(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <button
            type="submit"
            className={`cart-button w-100 ${loading ? "disabled" : ""}`}
            disabled={loading}
            style={{ marginBottom: "1rem", fontWeight: 500, color: "white",}}
          >
            {loading ? "..." : "Войти"}
          </button>
        </Form>
        <div style={{ textAlign: "center" }}>
          Нет аккаунта?{" "}
          <Link to="/register" style={{ color: "#4A86E8", textDecoration: "none" }}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
