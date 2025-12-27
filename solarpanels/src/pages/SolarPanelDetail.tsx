import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchPanelById, clearCurrentPanel } from "../slices/dataSlice";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import "../styles/details.css";
import defaultImg from "../resources/default.png";

function PanelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentPanel: panel, loading, error } = useAppSelector((state) => state.ourSolarPanels);

  useEffect(() => {
    if (id) {
      dispatch(fetchPanelById(Number(id)));
    }

    return () => {
      dispatch(clearCurrentPanel());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <Layout>
        <Breadcrumbs
          items={[
            { label: "Главная", path: "/" },
            { label: "Каталог панелей", path: "/panels" },
            { label: "Загрузка...", path: "" },
          ]}
        />
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </Layout>
    );
  }

  if (error || !panel) {
    return (
      <Layout>
        <Breadcrumbs
          items={[
            { label: "Главная", path: "/" },
            { label: "Каталог панелей", path: "/panels" },
            { label: "Ошибка", path: "" },
          ]}
        />
        <Alert variant="danger" className="mt-4">
          {error || "Панель не найдена"}
        </Alert>
        <Button variant="secondary" onClick={() => navigate("/panels")}>
          Назад к каталогу
        </Button>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumbs
        items={[
          { label: "Главная", path: "/" },
          { label: "Каталог панелей", path: "/panels" },
          { label: panel.Type, path: `/panels/${panel.ID}` }
        ]}
      />

      <Card className="panel-detail-card">
        <div className="panel-detail-grid">
          <img
            src={panel.Image || defaultImg}
            alt={panel.Type}
            className="panel-detail-image"
            onError={(e) => (e.currentTarget.src = defaultImg)}
          />
          
          <div className="panel-detail-info">
            <h1>{panel.Type}</h1>
            <p className="panel-power">
              <strong>Мощность:</strong> {panel.Power} Вт
            </p>
            <p className="panel-description">
              {panel.Description || `Высококачественная солнечная панель типа ${panel.Type} с мощностью ${panel.Power} Вт. Идеально подходит для бытового и коммерческого использования.`}
            </p>
            <div className="panel-specs">
              <p><strong>Размеры:</strong> {panel.Height} x {panel.Width} x {panel.Depth} мм</p>
              <p><strong>Эффективность:</strong> {panel.Efficiency}%</p>
            </div>
            <div className="panel-actions">
              <Button variant="outline-secondary" onClick={() => navigate("/panels")}>
                Назад к каталогу
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}

export default PanelDetails;
