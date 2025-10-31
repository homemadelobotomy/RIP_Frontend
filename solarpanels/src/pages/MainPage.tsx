
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Breadcrumbs from "../components/Breadcrumbs";

function HomePage() {
  return (
    <Layout>
      <Breadcrumbs items={[{ label: "Главная", path: "/" }]} />
      
      <div className="text-center my-5">
        <h1 className="display-4 mb-4">Добро пожаловать в магазин солнечных панелей</h1>
        <p className="lead text-muted mb-4">
          Мы предлагаем широкий выбор высококачественных солнечных панелей для любых потребностей.
          От монокристаллических до тонкопленочных решений — у нас есть всё для вашей энергетической независимости.
        </p>
        <Button as={Link as any} to="/panels" variant="primary" size="lg">
          Перейти в каталог
        </Button>
      </div>

      {/* <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Высокая эффективность</Card.Title>
              <Card.Text>
                Наши панели обеспечивают максимальную производительность даже при низкой освещенности
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Надежность</Card.Title>
              <Card.Text>
                Гарантия до 25 лет на все модели. Проверенные производители и сертифицированная продукция
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Экономия</Card.Title>
              <Card.Text>
                Снизьте расходы на электроэнергию до 80%. Окупаемость инвестиций от 3 до 7 лет
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </Layout>
  );
}

export default HomePage;
