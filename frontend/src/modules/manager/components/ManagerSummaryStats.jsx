import { Card, Col, Row } from 'react-bootstrap';

export function ManagerSummaryStats({ stats, ready, selected, onSelect }) {
  return <Row className="g-3 mb-4">
    {stats.map(([label, count, value]) => <Col xs={12} sm={4} key={label}>
      <Card className={`h-100 manager-summary-card${ready && selected === value ? ' is-active' : ''}`}>
        <button type="button" className="manager-summary-button card-body" disabled={!ready}
          aria-pressed={ready && selected === value} onClick={() => onSelect(value)}>
          <span className="text-muted">{label}</span>
          <div className="manager-stat">{ready ? count : '—'}</div>
        </button>
      </Card>
    </Col>)}
  </Row>;
}
