import { Dropdown } from "react-bootstrap";
import { getStatusBadge } from "./StatusBadge";

interface StatusBadgeWithActionsProps {
  req: any;
  isModerator: boolean;
  updatingRequestId: number | null;
  onStatusChange: (requestId: number, action: string) => void;
}

export const StatusBadgeWithActions = ({ 
  req, 
  isModerator, 
  updatingRequestId, 
  onStatusChange 
}: StatusBadgeWithActionsProps) => {
  const isFormed = req.status === "сформирован";
  const isUpdating = updatingRequestId === req.id;

  if (!isModerator || !isFormed) {
    return getStatusBadge({ status: req.status });
  }

  return (
    <Dropdown 
      onClick={(e) => e.stopPropagation()}
      drop="down"
    >
      <Dropdown.Toggle 
        variant="link" 
        disabled={isUpdating} 
        id={`dropdown-${req.id}`}
        as="div"
      >
        <span className="status-badge status-formed status-clickable">
          {isUpdating ? "Обновление..." : "Сформирован"}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu renderOnMount>
        <Dropdown.Item onClick={(e) => { e.stopPropagation(); onStatusChange(req.id!, "завершен"); }}>
          Рассчитать
        </Dropdown.Item>
        <Dropdown.Item onClick={(e) => { e.stopPropagation(); onStatusChange(req.id!, "отклонен"); }}>
          Отклонить
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
