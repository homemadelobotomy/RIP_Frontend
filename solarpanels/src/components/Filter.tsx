import { useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

interface FilterProps {
  initialBegin?: string;
  initialEnd?: string;
  onSearch: (begin: string, end: string) => void;
}

function Filter({ initialBegin = "", initialEnd = "", onSearch }: FilterProps) {
  const [start_value, setBegin] = useState<string>(initialBegin);
  const [end_value, setEnd] = useState<string>(initialEnd);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(start_value.trim(), end_value.trim());
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="align-items-end g-2">
        <Col xs={12} md={8}>
        
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="От"
              value={start_value}
              onChange={(e) => setBegin(e.target.value)}
              min={0}
            />
            <InputGroup.Text>-</InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="До"
              value={end_value}
              onChange={(e) => setEnd(e.target.value)}
              min={0}
            />
          </InputGroup>
        </Col>
        <Col xs={12} md={4}>
          <Button type="submit" variant="primary" className="w-100">
            Найти
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Filter;
