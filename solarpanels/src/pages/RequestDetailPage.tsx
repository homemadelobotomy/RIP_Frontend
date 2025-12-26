import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchCurrentSolarPanelRequest,
  updateSolarPanelArea,
  removeSolarPanelFromRequest,
  updateSolarPanelInsolation,
  deleteSolarPanelRequest,
  formateSolarPanelRequest,
  moderateSolarPanelRequest,
  fetchSolarPanelRequestInfo,
  clearSolarPanelRequestError,
} from "../slices/solarpanelRequestSlice";
import Layout from "../components/Layout";
import defaultImg from "../resources/default.png";
import "../styles/RequestDetailPage.css";
import Breadcrumbs from "../components/Breadcrumbs";
import cross from "../../public/cross.png"


function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentRequest, loading, isDraft, error } = useAppSelector((state) => state.solarpanelRequest);
  const { isModerator , isAuth} = useAppSelector((state) => state.auth);
  
  const [insolation, setInsolation] = useState(0);
  const [panelAreas, setPanelAreas] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!isAuth){
        navigate("/")
    }
    if (id) {
      dispatch(fetchCurrentSolarPanelRequest(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentRequest) {
      setInsolation(currentRequest.insolation || 0);
      const areas: Record<number, number> = {};
      currentRequest.solarpanels?.forEach((panel) => {
        if (panel.id) {
          areas[panel.id] = panel.area || 0;
        }
      });
      setPanelAreas(areas);
    }
  }, [currentRequest]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearSolarPanelRequestError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSaveAreaChanges = async (panelId: number) => {
      if (!id) return;
      
      const area = panelAreas[panelId];
      
      if (area === undefined || area < 0) {
        return;
      }

      const areaResult = await dispatch(updateSolarPanelArea({ 
        requestId: Number(id), 
        panelId, 
        area 
      }));
      
      if (updateSolarPanelArea.rejected.match(areaResult)) {
        return;
      }
  

    dispatch(fetchCurrentSolarPanelRequest(Number(id)));
  };
  const handleSaveInsolationChanges = async () => {
    if (!id) return;
    const insolationResult = await dispatch(updateSolarPanelInsolation({ requestId: Number(id), insolation }));
    
    if (updateSolarPanelInsolation.rejected.match(insolationResult)) {
      return;
    }
    dispatch(fetchCurrentSolarPanelRequest(Number(id)));
    
  };

  const handleRemovePanel = async (panelId: number) => {
    if (id) {
      await dispatch(removeSolarPanelFromRequest({ requestId: Number(id), panelId }));
      await dispatch(fetchCurrentSolarPanelRequest(Number(id)));
      console.log(currentRequest)
    }
  };

  const handleDeleteRequest = async () => {
    if (id) {
      await dispatch(deleteSolarPanelRequest(Number(id)));
      await dispatch(fetchSolarPanelRequestInfo());
      navigate("/panels");
    }
  };

  const handleFormateRequest = async () => {
    if (!id) return;
    const result = await dispatch(formateSolarPanelRequest(Number(id)));
    
    if (formateSolarPanelRequest.fulfilled.match(result)) {
      navigate("/solarpanel-requests");
    }
  };

  const handleModerate = async (action: string) => {
    if (id) {
      const result = await dispatch(moderateSolarPanelRequest({ requestId: Number(id), action }));
      
      if (moderateSolarPanelRequest.fulfilled.match(result)) {
        navigate("/solarpanel-requests");
      }
    }
  };

  if (loading || !currentRequest) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </Layout>
    );
  }
if (isDraft && !currentRequest.solarpanels?.length) {
  return (
    <Layout>
      <div 
        className="panels-container" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '400px'
        }}
      >
        <div 
          className="result-block" 
          style={{ 
            width: '500px', 
            height: 'auto', 
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <div className="result-title" style={{ marginBottom: '1.5rem', fontSize: '24px' }}>
            В заявке пока нет панелей
          </div>
          <p style={{ color: 'white', marginBottom: '2rem', fontSize: '16px' }}>
            Перейдите в каталог и добавьте солнечные панели
          </p>
          <button
            className="cart-button"
            onClick={() => navigate('/panels')}
            style={{ 
              width: '200px', 
              height: '50px', 
              fontSize: '18px',
              fontWeight: 500,
              background: 'white',
              color: '#4A86E8'
            }}
          >
            В каталог
          </button>
        </div>
      </div>
    </Layout>
  );
}

  return (
    <Layout>
      {error && (
        <Alert variant="danger" className="mx-auto" style={{ maxWidth: '1165px', marginTop: '1rem' }}>
          {error}
        </Alert>
      )}
    <Breadcrumbs
            items={
                isDraft
                ? [
                    { label: "Главная", path: "/" },
                    { label: "Каталог панелей", path: "/panels" },
                    { label: "Черновик расчета", path: `/requests/${id}` }
                    ]
                : [
                    { label: "Главная", path: "/" },
                    { label: "Все расчеты", path: "/solarpanel-requests" },
                    { label: `Расчет №${currentRequest?.id}`, path: `/requests/${id}` }
                    ]
            }
        />
      <div className="insolation-result-section">
        <div className="insolation-block">
          <label>Инсоляция в регионе</label>
          <input
            type="number"
            value={insolation || ""}
            onChange={(e) => setInsolation(Number(e.target.value))}
            placeholder="Введите значение"
            disabled={!isDraft}
            min="0"
          />
        </div>

        {isDraft && (
          <button 
            className="primary-request-btn"
            onClick={handleSaveInsolationChanges}
            style={{ height: '42px', padding: '0 24px' }}
          >
            Сохранить
          </button>
        )}

        <div className="result-block">
          <div className="result-title">Итоговая мощность в день</div>
          <div className="result-value">{currentRequest.total_power || 0} кВт</div>
        </div>
      </div>

      <div className="panels-container">
        {currentRequest.solarpanels?.map((panel) => (
          <div key={panel.id} className="panel-item">
      <div 
        className="panel-content-clickable"
        onClick={() => navigate(`/panels/${panel.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={panel.image || defaultImg}
          alt={panel.title}
          className="panel-image"
          onError={(e) => (e.currentTarget.src = defaultImg)}
        />
        <div className="panel-details">
          <div className="panel-info">
            <div className="panel-main-info">
              <div className="panel-title">{panel.title}</div>
              <div className="panel-power">Мощность {panel.power} Вт</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="panel-area-section" onClick={(e) => e.stopPropagation()}>
        <label>Площадь</label>
        <input
          type="number"
          value={panelAreas[panel.id!] || ""}
          onChange={(e) => setPanelAreas({ ...panelAreas, [panel.id!]: Number(e.target.value) })}
          placeholder="м²"
          disabled={!isDraft}
          min="0"
        />{isDraft && (
          <button className="primary-request-btn-sm"
            onClick={() => handleSaveAreaChanges(panel.id!)}
            style={{ height: '30px', padding: '0 20px' }}>
              Сохранить
          </button>)}
        
      </div>
      
      {isDraft && (
        <button
          className="delete-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleRemovePanel(panel.id!);
          }}
          title="Удалить панель"
        >
          <img src={cross} style={{ width: 10, height: 10 }}></img>
        </button>
      )}
    </div>
        ))}

        {isDraft &&  currentRequest.solarpanels?.length &&(
          <div className="delete-request-form">
            <button className="primary-request-btn" onClick={handleFormateRequest}>
              Сформировать расчет
            </button>
            <button
              className="delete-request-btn"
              style={{ marginLeft: "1rem" }}
              onClick={handleDeleteRequest}
            >
              Удалить расчет
            </button>
          </div>
        )}

        {isModerator && !isDraft && (
          <div className="delete-request-form">
            <button
              className="primary-request-btn"
              style={{ background: "#4A86E8" }}
              onClick={() => handleModerate("завершен")}
            >
              Расчитать
            </button>
            <button
              className="delete-request-btn"
              style={{ marginLeft: "1rem" }}
              onClick={() => handleModerate("отклонен")}
            >
              Отклонить расчет
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default RequestDetailPage;
