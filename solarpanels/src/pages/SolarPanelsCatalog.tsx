// src/pages/PanelsCatalog.tsx
import { useEffect, } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSolarPanels, setSolarPanelsInRequest } from "../slices/dataSlice";
import { getSolarPanels, getSolarPanelsRequestInfo } from "../getData";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import SolarPanelCard from "../components/SolarPanelCard";
import "../styles/catalog.css";
import cartIcon from "../resources/vector-50.svg";
import type { SolarPanel } from "../api/Api";
import { setEndValue, setStartValue } from "../slices/filterSlice";

function PanelsCatalog() {
  const dispatch = useAppDispatch();
  const panels = useAppSelector((state) => state.ourSolarPanels.SolarPanels);
  const panelsInRequest = useAppSelector((state) => state.ourSolarPanels.solarPanelsInRequest);

  const start_value = useAppSelector((state) => state.filter.start_value);
  const end_value = useAppSelector((state) => state.filter.end_value);


  useEffect(() => {
    getSolarPanels().then((data) => {
      dispatch(setSolarPanels(data));
    });

    getSolarPanelsRequestInfo().then((info) => {
      dispatch(setSolarPanelsInRequest(info.panels_in_request));
    });
  }, []);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await getSolarPanels(start_value || null, end_value || null);
      dispatch(setSolarPanels(data));
    } catch (error) {
      console.error("Ошибка поиска:", error);
      dispatch(setSolarPanels([]));
    }
  };

  const isCartDisabled = panelsInRequest <= 0;

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
                  onChange={(e) => dispatch(setStartValue(e.target.value))}
                  min={0}
                  className="start_value"
                />
                <InputGroup.Text className="range-separator">-</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="До"
                  value={end_value}
                  onChange={(e) => dispatch(setEndValue(e.target.value))}
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

        <button className={`cart-button ${isCartDisabled ? "disabled" : ""}`} disabled={isCartDisabled}>
          <img src={cartIcon} alt="Корзина" style={{ width: 20, height: 20 }} />
          {!isCartDisabled && <span className="cart-badge">{panelsInRequest}</span>}
        </button>
      </div>

      {panels.length === 0 && (
        <Alert variant="warning" className="mt-4">
          Нет панелей, соответствующих заданным фильтрам
        </Alert>
      )}

      <div className="catalog-grid">
        {panels.map((panel:SolarPanel) => (
          <SolarPanelCard key={panel.ID} panel={panel} />
        ))}
      </div>
    </Layout>
  );
}

export default PanelsCatalog;
