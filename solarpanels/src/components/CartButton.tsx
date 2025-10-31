import { useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getSolarPanelsRequestInfo} from '../api/Api';
import type {SolarPanelsRequestInfo } from '../api/Api'

function CartButton() {
    const [solarpanelRequestInfo, setSolarpanelRequestInfo] = useState<SolarPanelsRequestInfo>({request_id:0, panels_in_request:-1});

     useEffect(() => {
    let cancelled = false;
    
    getSolarPanelsRequestInfo().then((info: SolarPanelsRequestInfo) => {
      if (!cancelled) setSolarpanelRequestInfo(info);
    });
    
    return () => {
      cancelled = true;
    };
  }, []);


  const { request_id, panels_in_request } = solarpanelRequestInfo;

  return (
    <Button 
      as={Link as any} 
      to={`/solar_panels_request/${request_id}`} 
      variant="warning"
    >
      <img
        src="/resources/vector-50.svg"
        alt="Корзина"
        style={{ width: 16, marginRight: 8 }}
      />
      <Badge bg="danger">{panels_in_request}</Badge>
      <span className="visually-hidden">товаров в корзине</span>
    </Button>
  );
}

export default CartButton;