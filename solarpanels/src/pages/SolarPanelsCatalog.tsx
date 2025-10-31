
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import SolarPanelCard from "../components/SolarPanelCard";
import { getSolarPanels, getSolarPanelsRequestInfo } from "../api/Api";
import type { SolarPanel, SolarPanelsRequestInfo } from "../api/Api";
import "../styles/catalog.css";
import cartIcon from '../resources/vector-50.svg'

function PanelsCatalog() {
   const [start_value, setBegin] = useState<string>("");
  const [end_value, setEnd] = useState<string>("");

  const navigate = useNavigate();
  const [panels, setPanels] = useState<SolarPanel[]>([]);
  
  
  const [cartInfo, setCartInfo] = useState<SolarPanelsRequestInfo>({
    request_id: 0,
    panels_in_request: -1
  });


  useEffect(() => {
    getSolarPanels().then((data:SolarPanel[]) => {
      setPanels(data)
    })
    getSolarPanelsRequestInfo().then((info: SolarPanelsRequestInfo) => {
        setCartInfo(info);
    });
    
    return () => {
      
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await getSolarPanels(
        start_value || null,
        end_value || null
      );
      setPanels(data);
    } catch (error) {
      console.error("Ошибка при загрузке панелей:", error);
      setPanels([]);
    }
  };

  const handleCartClick = () => {
    if (cartInfo.panels_in_request > 0 && cartInfo.request_id > 0) {
      navigate(`/solar_panels_request/${cartInfo.request_id}`);
    }
  };

  const isCartDisabled = cartInfo.panels_in_request <= 0 || cartInfo.request_id <= 0;

  return (
    <Layout>
      <Breadcrumbs />
      
          <div className="search-controls-wrapper">
        <div className="filter-wrapper">
          <h2 className="search-title">Фильтр по мощности</h2>
          <Form onSubmit={handleSearch} className="search-form">
            <div className="filter-inputs">
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="От"
                  value={start_value}
                  onChange={(e) => setBegin(e.target.value)}
                  min={0}
                  className="start_value"
                />
                <InputGroup.Text className="range-separator">-</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="До"
                  value={end_value}
                  onChange={(e) => setEnd(e.target.value)}
                  min={0}
                  className="end_value"
                />
              </InputGroup>
              <Button type="submit" variant="primary" className="search-btn">
                Найти
              </Button>
            </div>
          </Form>
        </div>

        <button
          className={`cart-button ${isCartDisabled ? "disabled" : ""}`}
          onClick={handleCartClick}
          disabled={isCartDisabled}
        >
          <img
            src={cartIcon}
            alt="Корзина"
            style={{ width: 20, height: 20 }}
          />
          { !isCartDisabled &&(
            <span className="cart-badge">{cartInfo.panels_in_request}</span>
          )}
        </button>
      </div>

      {panels.length === 0 && (
        <Alert variant="warning" className="mt-4">
          Нет панелей, соответствующих заданным фильтрам
        </Alert>
      )}

      <div className="catalog-grid">
        {panels.map((panel) => (
          <SolarPanelCard key={panel.ID} panel={panel} />
        ))}
      </div>
    </Layout>
  );
}

export default PanelsCatalog;
