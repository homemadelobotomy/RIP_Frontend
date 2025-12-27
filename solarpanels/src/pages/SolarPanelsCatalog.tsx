import { useEffect, useState, useRef } from "react";
import { Form, Button, InputGroup, Alert, Modal, ProgressBar } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchSolarPanels } from "../slices/dataSlice";
import { fetchSolarPanelRequestInfo } from "../slices/solarpanelRequestSlice";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import SolarPanelSearchCard from "../components/SolarPanelSearchCard";
import { useSolarPanelSearch } from "../hooks/useSolarPanelSearch";
import "../styles/catalog.css";
import filterIcon from "../../public/Filter.png";
import { setSolarPanelEndValue, setSolarPanelStartValue } from "../slices/filterSlice";
import CartButton from "../components/CartButton";

function PanelsCatalog() {
  const dispatch = useAppDispatch();

  const { solarPanels: panels } = useAppSelector((state) => state.ourSolarPanels);
  const { start_value, end_value } = useAppSelector((state) => state.filter);
  const { isAuth } = useAppSelector((state) => state.auth);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    items: searchItems,
    ready,
    progress,
    imageEmbedding,
    searchByImage,
    resetSearch,
  } = useSolarPanelSearch(panels);

  useEffect(() => {
    dispatch(fetchSolarPanels({ start_value, end_value }));
  }, [dispatch]); 
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchSolarPanelRequestInfo());
    }
  }, [dispatch, isAuth]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (imageEmbedding) {
      handleClearImage();
    }
    await dispatch(fetchSolarPanels({ start_value, end_value }));
    setShowFilter(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      searchByImage(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    resetSearch();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayPanels = imageEmbedding ? searchItems.filter((p) => p.isVisible) : searchItems;
  const isImageSearch = Boolean(imageEmbedding);

  const uploadLabel = ready ? "Загрузить изображение" : "Загрузка модели...";
  const isUploadDisabled = !ready;
  const canReset = Boolean(selectedImage);

  return (
    <Layout>
      <Breadcrumbs />

      
      <div className="filter-section">
        <Button
          variant="outline-primary"
          onClick={() => setShowFilter(true)}
          className="filter-toggle-btn"
        >
          <img src={filterIcon} style={{ width: 30, height: 30 }} alt="Filter" />
        </Button>

        <div className="filter-desktop">
          <Form onSubmit={handleSearch} className="filter-form">
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="От"
                value={start_value ?? ""}
                onChange={(e) =>
                  dispatch(setSolarPanelStartValue(e.target.value ? Number(e.target.value) : null))
                }
                min={0}
              />
              <InputGroup.Text>-</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="До"
                value={end_value ?? ""}
                onChange={(e) =>
                  dispatch(setSolarPanelEndValue(e.target.value ? Number(e.target.value) : null))
                }
                min={0}
              />
            </InputGroup>
            <Button type="submit" variant="primary">
              Найти
            </Button>
          </Form>
        </div>

        <CartButton />
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
                onChange={(e) =>
                  dispatch(setSolarPanelStartValue(e.target.value ? Number(e.target.value) : null))
                }
                min={0}
              />
              <InputGroup.Text>-</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="До"
                value={end_value ?? ""}
                onChange={(e) =>
                  dispatch(setSolarPanelEndValue(e.target.value ? Number(e.target.value) : null))
                }
                min={0}
              />
            </InputGroup>
            <Button type="submit" variant="primary" className="w-100">
              Найти
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      
      <div className="image-search-section mt-4 p-3 bg-light rounded">
        <h5 className="mb-3">Поиск по изображению</h5>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />

        <div className="d-flex gap-3 align-items-start flex-wrap">
          <div style={{ flexShrink: 0 }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Query"
                className="rounded border"
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded border border-secondary d-flex align-items-center justify-content-center text-muted"
                style={{
                  width: 150,
                  height: 150,
                  borderStyle: "dashed",
                  backgroundColor: "#e9ecef",
                }}
              >
                <span>Нет изображения</span>
              </div>
            )}
          </div>

          <div className="d-flex flex-column gap-2" style={{ minWidth: 200 }}>
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadDisabled}
              className="w-100"
            >
              {uploadLabel}
            </Button>

            {!ready && (
              <ProgressBar now={progress} label={`${Math.round(progress)}%`} animated />
            )}

            <Button
              variant="outline-danger"
              onClick={handleClearImage}
              disabled={!canReset}
              className="w-100"
            >
              Сбросить
            </Button>

            {imageEmbedding && (
              <div className="small text-muted">
                <strong>Image Embedding:</strong>
                <br />
                {imageEmbedding.slice(0, 5).map((n) => n.toFixed(3)).join(", ")}...
              </div>
            )}
          </div>
        </div>
      </div>

      {displayPanels.length === 0 && (
        <Alert variant="warning" className="mt-4">
          {isImageSearch ? "Нет панелей, соответствующих изображению" : "Нет панелей"}
        </Alert>
      )}

      <div className="catalog-grid mt-4">
        {displayPanels.map((panel) => (
          <SolarPanelSearchCard key={panel.ID} panel={panel} showScore={isImageSearch} />
        ))}
      </div>
    </Layout>
  );
}

export default PanelsCatalog;
