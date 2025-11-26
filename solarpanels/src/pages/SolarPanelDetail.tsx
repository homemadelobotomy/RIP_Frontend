import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert } from "react-bootstrap";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import { getPanelByID } from "../getData";
import { useAppSelector } from "../hooks";
import "../styles/details.css";
import defaultImg from "../resources/default.png";

function PanelDetails() {
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();


const panel = useAppSelector((state) =>
state.ourSolarPanels?.SolarPanels?.find((p) => p.ID === Number(id))
);

useEffect(() => {

  getPanelByID(Number(id))
    .then((data) => {
      console.log("Загружена панель:", data);
    })
    .catch((err) => {
      console.error("Ошибка загрузки панели:", err);
    });

}, []);


// Показываем ошибку
if (!panel) {
return (
<Layout>
<Breadcrumbs
items={[
{ label: "Главная", path: "/" },
{ label: "Каталог панелей", path: "/panels" },
{ label: "Ошибка", path: "" },
]}
/>
<Alert variant="danger">{"Панель не найдена"}</Alert>
<Button variant="secondary" onClick={() => navigate("/panels")}>
Назад к каталогу
</Button>
</Layout>
);
}

// Показываем детали панели
return (
<Layout>
<Breadcrumbs
items={[
  { label: "Главная", path: "/" },
  { label: "Каталог панелей", path: "/panels" },
  { label: panel.Type, path: `/panels/${panel.Type}`}
]}/>

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