import { useEffect, useState } from "react";
import { Form, Button, InputGroup, Alert, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchSolarPanels } from "../slices/dataSlice";
import { fetchRequestInfo } from "../slices/solarpanelRequestSlice";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import SolarPanelCard from "../components/SolarPanelCard";
import "../styles/catalog.css";
import filterIcon from "../../public/Filter.png"
import { setEndValue, setStartValue } from "../slices/filterSlice";
import CartButton from "../components/CartButton";

function PanelsCatalog() {
    const dispatch = useAppDispatch();
  
  const { solarPanels: panels } = useAppSelector((state) => state.ourSolarPanels);
  const { start_value, end_value } = useAppSelector((state) => state.filter);
  const { isAuth } = useAppSelector((state) => state.auth);

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    dispatch(fetchSolarPanels({ start_value, end_value }));
    
    if (isAuth) {
      dispatch(fetchRequestInfo());
    }
  }, [dispatch, isAuth]);

    const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(fetchSolarPanels({ start_value, end_value }));
    setShowFilter(false);
  };


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
              value={start_value ?? ""}
              onChange={(e) => dispatch(setStartValue(e.target.value ? Number(e.target.value) : null))}
              min={0}
            />
            <InputGroup.Text>-</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="До"
              value={end_value ?? ""}
              onChange={(e) => dispatch(setEndValue(e.target.value ? Number(e.target.value) : null))}
              min={0}
            />
          </InputGroup>
          <Button type="submit" variant="primary">Найти</Button>
        </Form>
      </div>


      <CartButton/>
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
              value={start_value ?? ""}
              onChange={(e) => dispatch(setStartValue(e.target.value ? Number(e.target.value) : null))}
              min={0}
            />
            <InputGroup.Text>-</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="До"
              value={end_value ?? ""}
              onChange={(e) => dispatch(setEndValue(e.target.value ? Number(e.target.value) : null))}

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
