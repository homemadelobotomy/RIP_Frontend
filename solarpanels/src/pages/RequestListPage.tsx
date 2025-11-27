import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchRequestsList } from "../slices/solarpanelRequestSlice";
import Layout from "../components/Layout";
import "../styles/RequestsList.css";
import Breadcrumbs from "../components/Breadcrumbs";
import { resetRequestFilter, setEndDate, setStartDate, setStatus } from "../slices/requestFilter";

function RequestsListPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const { requestsList } = useAppSelector((state) => state.solarpanelRequest);
    const { isModerator, isAuth, login} = useAppSelector((state) => state.auth);
    const { status, start_date, end_date } = useAppSelector((state) => state.requestFilter);


    const formatDateForAPI = (dateString: string): string => {
        if (!dateString) return "";
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        };

    const loadRequests = () => {
        setLoading(true)
        const filters: { start_date?: string; end_date?: string; status?: string } = {};

        if (status) filters.status = status;
        if (start_date) filters.start_date = formatDateForAPI(start_date + " 00:00:00");
        if (end_date) filters.end_date = formatDateForAPI(end_date + " 23:59:59");

        dispatch(fetchRequestsList(filters)).finally(() => setLoading(false));
  };
    useEffect(() => {
    if (!isAuth) {
        navigate("/")
    }
   loadRequests();

    }, [dispatch]);

    const getStatusBadge = (status?: string) => {
    let className = "status-badge ";
    let text = status || "Неизвестно";

    if (status === "черновик") {
    className += "status-draft";
    text = "Черновик";
    } else if (status === "сформирован") {
    className += "status-formed";
    text = "Сформирован";
    } else if (status === "завершен") {
    className += "status-completed";
    text = "Завершен";
    } else if (status === "отклонен") {
    className += "status-rejected";
    text = "Отклонен";
    }

    return <span className={className}>{text}</span>;
    };
    const handleResetFilter = () => {
        dispatch(resetRequestFilter());
        dispatch(fetchRequestsList())
    };

     const handleApplyFilter = () => {
        loadRequests();
    };

    const filteredRequests = isModerator
    ? requestsList.filter((req) => req.status === "сформирован" || req.creator == login)
    : requestsList;

    if (loading) {
    return (
    <Layout>
        <div className="text-center mt-5">
        <Spinner animation="border" />
        </div>
    </Layout>
    );
    }

    return (
    <Layout>
        <Breadcrumbs
            items={[
                { label: "Главная", path: "/" },
                { label: "Все расчеты", path: "/solarpanel-requests" }
            ]}
        />

    <div className="requests-page">
        <h2>{isModerator ? "Расчеты на модерацию" : "Мои расчеты"}</h2>

        <div className="requests-filter" style={{ marginBottom: '2rem' }}>
          <Form>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>Статус</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(e) => dispatch(setStatus(e.target.value))}
                >
                  <option value="">Все</option>
                  <option value="сформирован">Сформирован</option>
                  <option value="завершен">Завершен</option>
                  <option value="отклонен">Отклонен</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Дата формирования от</Form.Label>
                <Form.Control
                  type="date"
                  value={start_date}
                  onChange={(e) => dispatch(setStartDate(e.target.value))}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Дата формирования до</Form.Label>
                <Form.Control
                  type="date"
                  value={end_date}
                  onChange={(e) => dispatch(setEndDate(e.target.value))}
                />
              </Col>
              <Col md={2}>
                <Form.Label>&nbsp;</Form.Label>
                <Button
                  variant="primary"
                  onClick={handleApplyFilter}
                  className="w-100"
                >
                  Применить
                </Button>
              </Col>
              <Col md={1}>
                <Form.Label>&nbsp;</Form.Label>
                <Button
                  variant="secondary"
                  onClick={handleResetFilter}
                  className="w-100"
                >
                  Сброс
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {filteredRequests.length === 0 ? (
        <div className="no-requests">
            <p>Нет расчетов</p>
        </div>
        ) : (
        <div className="requests-table-container">
            <table className="requests-table">
            <thead>
                <tr>
                <th>ID</th>
                {isModerator && <th>Пользователь</th>}
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Дата формирования</th>
                <th>Дата завершения</th>
                </tr>
            </thead>
            <tbody>
                {filteredRequests.map((req) => (
                <tr
                    key={req.id}
                    onClick={() => navigate(`/requests/${req.id}`)}
                >
                    <td>{req.id}</td>
                    {isModerator && <td>{req.creator || "—"}</td>}
                    <td>{getStatusBadge(req.status)}</td>
                    <td>{req.created_at || "—"}</td>
                    <td>{req.formated_at || "—"}</td>
                    <td>{req.moderated_at || "—"}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
    </div>
    </Layout>
    );
}

export default RequestsListPage;
