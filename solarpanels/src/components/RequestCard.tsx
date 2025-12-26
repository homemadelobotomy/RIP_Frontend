import { Card } from "react-bootstrap";
import { StatusBadgeWithActions } from "./StatusBadgeWithActions";
import { formatDate } from "../utils/dataUtils";
import "../styles/RequestsList.css"

interface RequestCardProps {
  req: any;
  isModerator: boolean;
  updatingRequestId: number | null;
  onStatusChange: (requestId: number, action: string) => void;
  onClick: () => void;
}

export const RequestCard = ({ req, isModerator, updatingRequestId, onStatusChange, onClick }: RequestCardProps) => {
  return (
    <Card className="request-card" onClick={onClick}>
      <Card.Body>
        <div className="card-content">
          <div className="card-id-section">
            <span className="card-label">ID</span>
            <span className="card-id">{req.id}</span>
          </div>
          
          <div className="card-details">
            <div className="card-info">
              <span className="info-label">Статус</span>
              <StatusBadgeWithActions 
                req={req} 
                isModerator={isModerator} 
                updatingRequestId={updatingRequestId} 
                onStatusChange={onStatusChange} 
              />
            </div>
            
            {isModerator && (
              <div className="card-info">
                <span className="info-label">Пользователь</span>
                <span className="info-value">{req.creator || "—"}</span>
              </div>
            )}
            
            <div className="card-info">
              <span className="info-label">Создан</span>
              <span className="info-value">{formatDate(req.created_at)}</span>
            </div>
            
            <div className="card-info">
              <span className="info-label">Сформирован</span>
              <span className="info-value">{formatDate(req.formated_at)}</span>
            </div>
            
            <div className="card-info">
              <span className="info-label">Завершен</span>
              <span className="info-value">{formatDate(req.moderated_at)}</span>
            </div>
            
            <div className="card-info">
              <span className="info-label">Мощность</span>
              <span className="power-value">
                {req.total_power ? `${req.total_power} кВт` : "—"}
              </span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
