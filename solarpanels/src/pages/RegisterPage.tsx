import { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { registerUser } from "../slices/authSlice";
import Layout from "../components/Layout";
import "../styles/catalog.css";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    const result = await dispatch(registerUser({ login, password }));
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1000);
    } else {
        const errorMessage = result.payload as string
      
        setError(errorMessage)
    }
  };

  return (
    <Layout>
      <div className="filter-section" style={{ flexDirection: "column", maxWidth: 400, margin: "80px auto 0" }}>
        <h2 style={{ color: "#666", fontFamily: "'Noto Sans', Arial, sans-serif", textAlign: "center", marginBottom: "2rem" }}>
          Регистрация
        </h2>
        {error && <Alert variant="danger" className="w-100 mb-2">{error}</Alert>}
        {success && <Alert variant="success" className="w-100 mb-2">Успешно! Перенаправление...</Alert>}
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
          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Подтвердите пароль</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <button
            type="submit"
            className={`cart-button w-100 ${loading ? "disabled" : ""}`}
            disabled={loading}
            style={{ marginBottom: "1rem", fontWeight: 500, color:"white" }}
          >
            {loading ? "..." : "Зарегистрироваться"}
          </button>
        </Form>
        <div style={{ textAlign: "center" }}>
          Уже есть аккаунт?{" "}
          <Link to="/login" style={{ color: "#4A86E8", textDecoration: "none" }}>
            Войти
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default RegisterPage;
