
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { SolarPanel } from "../api/Api";

interface SolarPanelCardProps {
  panel: SolarPanel;
}

const DEFAULT_IMAGE = "http://localhost:9000/images/default.png"; 

function SolarPanelCard({ panel }: SolarPanelCardProps) {
  const navigate = useNavigate();
  const imageUrl = panel.Image || DEFAULT_IMAGE;

  return (
    <Card className="product-card h-100">
      <div className="card-image-container">
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={panel.Type}
          className="card-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
          }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="card-title">{panel.Type}</Card.Title>
        <Card.Text className="card-power">Мощность: {panel.Power} Вт</Card.Text>
        <Button
          variant="outline-primary"
          className="mt-auto card-button"
          onClick={() => navigate(`/panels/${panel.ID}`)}
        >
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SolarPanelCard;
