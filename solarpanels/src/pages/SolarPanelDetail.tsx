
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import { getPanelByID } from "../api/Api";
import type { SolarPanel } from "../api/Api";
import "../styles/details.css";
import defaultImg from "../resources/default.png"

const DEFAULT_IMAGE = defaultImg;

function PanelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [panel, setPanel] = useState<SolarPanel | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    if (id) {
      getPanelByID(id)
        .then((data) => {
          if (!cancelled) {
            setPanel(data);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setError("Не удалось загрузить данные панели");
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error || !panel) {
    return (
      <Layout>
        <Breadcrumbs />
        <Alert variant="danger">{error || "Панель не найдена"}</Alert>
        <Button variant="secondary" onClick={() => navigate("/panels")}>
          Вернуться к каталогу
        </Button>
      </Layout>
    );
  }

  const imageUrl = panel.Image || DEFAULT_IMAGE;

  return (
    <Layout>
      <Breadcrumbs
        items={[
          { label: "Главная", path: "/" },
          { label: "Каталог панелей", path: "/panels" },
          { label: panel.Type, path: `/panels/${panel.ID}` },
        ]}
      />

      <Card className="panel-details-card">
        <Row className="g-0">
          <Col md={5}>
            <Card.Img
              src={imageUrl}
              alt={panel.Type}
              className="panel-detail-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
              }}
            />
          </Col>
          <Col md={7}>
            <Card.Body className="panel-detail-body">
              <Card.Title className="panel-detail-title">{panel.Type}</Card.Title>
              <Card.Text className="panel-detail-power">
                <strong>Мощность:</strong> {panel.Power} Вт
              </Card.Text>
              <Card.Text className="panel-detail-description">
                Высококачественная солнечная панель типа {panel.Type} с мощностью {panel.Power} Вт.
                Идеально подходит для бытового и коммерческого использования.
              </Card.Text>
              <div className="mt-4">
                <Button variant="outline-secondary" onClick={() => navigate("/panels")}>
                  Назад к каталогу
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Layout>
  );
}

export default PanelDetails;
