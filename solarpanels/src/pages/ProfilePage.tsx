import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateUserLogin } from "../slices/authSlice";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuth, login: currentLogin } = useAppSelector((state) => state.auth);
  
  const [newLogin, setNewLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
    if (currentLogin) {
      setNewLogin(currentLogin);
    }
  }, [isAuth, currentLogin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newLogin.trim() === "") {
      setError("Логин не может быть пустым");
      return;
    }

    if (newLogin === currentLogin) {
      setError("Новый логин совпадает с текущим");
      return;
    }

    setLoading(true);
    const result = await dispatch(updateUserLogin(newLogin));
    setLoading(false);

    if (updateUserLogin.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const errorMessage = typeof result.payload === 'string' 
        ? result.payload 
        : "Ошибка изменения логина";
      setError(errorMessage);
    }
  };

  if (!isAuth) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs
        items={[
          { label: "Главная", path: "/" },
          { label: "Профиль", path: "/profile" }
        ]}
      />

      <div className="profile-container">
        <h2>Профиль</h2>

        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            Логин успешно изменен!
          </Alert>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}

        <div className="profile-card">
          <div className="profile-info">
            <label>Текущий логин</label>
            <div className="current-login">{currentLogin}</div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Новый логин</Form.Label>
              <Form.Control
                type="text"
                value={newLogin}
                onChange={(e) => setNewLogin(e.target.value)}
                placeholder="Введите новый логин"
                disabled={loading}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100"
            >
              {loading ? "Сохранение..." : "Изменить логин"}
            </Button>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

export default ProfilePage;
