import { useEffect, useState } from "react";
import { Form, Button, InputGroup, Alert, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSolarPanels, setSolarPanelsInRequest } from "../slices/dataSlice";
import { getSolarPanels, getSolarPanelsRequestInfo } from "../getData";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import SolarPanelCard from "../components/SolarPanelCard";
import "../styles/catalog.css";
import cartIcon from "../resources/vector-50.svg";
import filterIcon from "../../public/Filter.png"
import { setEndValue, setStartValue } from "../slices/filterSlice";

function PanelsCatalog() {
  const dispatch = useAppDispatch();
  const panels = useAppSelector((state) => state.ourSolarPanels?.SolarPanels ?? []);
  const panelsInRequest = useAppSelector((state) => state.ourSolarPanels.solarPanelsInRequest);
  const start_value = useAppSelector((state) => state.filter.start_value);
  const end_value = useAppSelector((state) => state.filter.end_value);

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    getSolarPanels(start_value,end_value)
      .then((data) => {
        dispatch(setSolarPanels(data));
      })
      .catch(() => {
        dispatch(setSolarPanels([]));
      });
    getSolarPanelsRequestInfo().then((info) => dispatch(setSolarPanelsInRequest(info.panels_in_request)));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await getSolarPanels(start_value || null, end_value || null);
      dispatch(setSolarPanels(data));
      setShowFilter(false); 
    } catch (error) {
      console.error("Ошибка поиска:", error);
      dispatch(setSolarPanels([]));
    }
  };

  const isCartDisabled = panelsInRequest <= 0;

  return (
  <Layout>
    <Breadcrumbs />

    <div className="filter-section">
      <Button 
        variant="outline-primary" 
        onClick={() => setShowFilter(true)} 
        className="filter-toggle-btn"
      >
        <img src={filterIcon} style={{width:30 ,height:30 }}></img>
      </Button>

      
      <div className="filter-desktop">
        <Form onSubmit={handleSearch} className="filter-form">
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="От"
              value={start_value}
              onChange={(e) => dispatch(setStartValue(e.target.value))}
              min={0}
            />
            <InputGroup.Text>-</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="До"
              value={end_value}
              onChange={(e) => dispatch(setEndValue(e.target.value))}
              min={0}
            />
          </InputGroup>
          <Button type="submit" variant="primary">Найти</Button>
        </Form>
      </div>


      <button className={`cart-button ${isCartDisabled ? "disabled" : ""}`} disabled={isCartDisabled}>
        <img src={cartIcon} alt="Корзина" style={{ width: 20, height: 20 }} />
        {!isCartDisabled && <span className="cart-badge">{panelsInRequest}</span>}
      </button>
    </div>


    <Modal show={showFilter} onHide={() => setShowFilter(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Фильтр по мощности</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3">
            <Form.Control
              type="number"
              placeholder="От"
              value={start_value}
              onChange={(e) => dispatch(setStartValue(e.target.value))}
              min={0}
            />
            <InputGroup.Text>-</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="До"
              value={end_value}
              onChange={(e) => dispatch(setEndValue(e.target.value))}
              min={0}
            />
          </InputGroup>
          <Button type="submit" variant="primary" className="w-100">Найти</Button>
        </Form>
      </Modal.Body>
    </Modal>

    {panels.length === 0 && <Alert variant="warning" className="mt-4">Нет панелей</Alert>}

    <div className="catalog-grid">
      {panels.map((panel) => (
        <SolarPanelCard key={panel.ID} panel={panel} />
      ))}
    </div>
  </Layout>
);

}

export default PanelsCatalog;
