import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchSolarPanelRequestsList, moderateSolarPanelRequest } from "../slices/solarpanelRequestSlice";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";
import { RequestCard } from "../components/RequestCard";
import { formatDateForAPI } from "../utils/dataUtils";
import { resetSolarPanelRequestFilter, setSolarPanelRequestEndDate, setSolarPanelRequestStartDate, setSolarPanelRequestStatus, setSolarPanelRequestCreator } from "../slices/requestFilter";
import "../styles/RequestsList.css";

const POLLING_INTERVAL = 5000;

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function RequestsListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pollingTrigger, setPollingTrigger] = useState(0);
  const [updatingRequestId, setUpdatingRequestId] = useState<number | null>(null);
  const [appliedFilters, setAppliedFilters] = useState({
    status: '', start_date: '', end_date: '', creator: ''
  });

  const { requestsList } = useAppSelector((state) => state.solarpanelRequest);
  const { isModerator, isAuth } = useAppSelector((state) => state.auth);
  const { status, start_date, end_date, creator } = useAppSelector((state) => state.requestFilter);

  const loadRequests = useCallback((filters: { status: string; start_date: string; end_date: string }) => {
    const apiFilters: { start_date?: string; end_date?: string; status?: string } = {};
    if (filters.status) apiFilters.status = filters.status;
    if (filters.start_date) apiFilters.start_date = formatDateForAPI(filters.start_date + " 00:00:00");
    if (filters.end_date) apiFilters.end_date = formatDateForAPI(filters.end_date + " 23:59:59");
    return dispatch(fetchSolarPanelRequestsList(apiFilters));
  }, [dispatch]);

  
   useEffect(() => {
    if (!isAuth) {
      navigate("/");
      return;
    }
    
    const today = getTodayDate();
    
    if (!start_date) {
      dispatch(setSolarPanelRequestStartDate(today));
    }
    if (!end_date) {
      dispatch(setSolarPanelRequestEndDate(today));
    }
    
    const initialFilters = {
      status: status || '',
      start_date: start_date || today,
      end_date: end_date || today,
      creator: creator || ''
    };
    
    setAppliedFilters(initialFilters);
    setLoading(true);
    loadRequests(initialFilters).finally(() => setLoading(false));
  }, [isAuth, navigate]); 

  useEffect(() => {
    if (!isAuth || !isModerator) return;
    const timeoutId = setTimeout(() => {
      loadRequests(appliedFilters).finally(() => setPollingTrigger(prev => prev + 1));
    }, POLLING_INTERVAL);
    return () => clearTimeout(timeoutId);
  }, [isAuth, appliedFilters, pollingTrigger]);

    function handleResetFilter () {
    dispatch(resetSolarPanelRequestFilter());
    setAppliedFilters({ status: '', start_date: '', end_date: '', creator: '' });
    setLoading(true);
    loadRequests({ status: '', start_date: '', end_date: '' }).finally(() => setLoading(false));
  }

    function handleApplyFilter (){
    const newFilters = { status, start_date, end_date, creator };
    setAppliedFilters(newFilters);
    setLoading(true);
    loadRequests(newFilters).finally(() => setLoading(false));
  }

  const handleStatusChange = async (requestId: number, action: string) => {
    setUpdatingRequestId(requestId);
    const result = await dispatch(moderateSolarPanelRequest({ requestId, action }));
    if (moderateSolarPanelRequest.fulfilled.match(result)) {
      await loadRequests(appliedFilters);
    }
    setUpdatingRequestId(null);
  };

  const filteredRequests = requestsList.filter((req) => {
    if (!appliedFilters.creator) return true;
    return req.creator?.toLowerCase().includes(appliedFilters.creator.toLowerCase());
  });

  const uniqueCreators = Array.from(new Set(requestsList.map(req => req.creator).filter(Boolean)));

  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Главная", path: "/" }, { label: "Все расчеты", path: "/solarpanel-requests" }]} />
      <div className="requests-page">
        <h2>{isModerator ? "Расчеты на модерацию" : "Мои расчеты"}</h2>
        <div className="requests-filter">
          <Form>
            <Row className="g-3">
              <Col md={isModerator ? 2 : 3}>
                <Form.Label>Статус</Form.Label>
                <Form.Select value={status} onChange={(e) => dispatch(setSolarPanelRequestStatus(e.target.value))}>
                  <option value="">Все</option>
                  <option value="сформирован">Сформирован</option>
                  <option value="завершен">Завершен</option>
                  <option value="отклонен">Отклонен</option>
                </Form.Select>
              </Col>
              {isModerator && (
                <Col md={2}>
                  <Form.Label>Создатель</Form.Label>
                  <Form.Control type="text" placeholder="Логин" value={creator} onChange={(e) => dispatch(setSolarPanelRequestCreator(e.target.value))} list="creators-list" />
                  <datalist id="creators-list">
                    {uniqueCreators.map(c => <option key={c} value={c} />)}
                  </datalist>
                </Col>
              )}
              <Col md={isModerator ? 2 : 3}>
                <Form.Label>Дата от</Form.Label>
                <Form.Control type="date" value={start_date} onChange={(e) => dispatch(setSolarPanelRequestStartDate(e.target.value))} />
              </Col>
              <Col md={isModerator ? 2 : 3}>
                <Form.Label>Дата до</Form.Label>
                <Form.Control type="date" value={end_date} onChange={(e) => dispatch(setSolarPanelRequestEndDate(e.target.value))} />
              </Col>
              <Col md={2}>
                <Form.Label>&nbsp;</Form.Label>
                <Button variant="primary" onClick={handleApplyFilter} className="w-100">Применить</Button>
              </Col>
              <Col md={isModerator ? 2 : 1}>
                <Form.Label>&nbsp;</Form.Label>
                <Button variant="secondary" onClick={handleResetFilter} className="w-100">Сброс</Button>
              </Col>
            </Row>
          </Form>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="no-requests"><p>Нет расчетов</p></div>
        ) : (
          <div className="requests-cards">
            {filteredRequests.map((req) => (
              <RequestCard 
                key={req.id} 
                req={req} 
                isModerator={isModerator} 
                updatingRequestId={updatingRequestId} 
                onStatusChange={handleStatusChange} 
                onClick={() => navigate(`/solarpanel-requests/${req.id}`)} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default RequestsListPage;
