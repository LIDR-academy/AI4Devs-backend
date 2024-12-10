import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getCandidatesForPosition } from '../services/positionService';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const { id } = useParams();
    const [columns, setColumns] = useState([
        { id: 1, title: 'Selección Inicial', candidates: [] },
        { id: 2, title: 'Entrevista Técnica', candidates: [] },
        { id: 3, title: 'Entrevista de RRHH', candidates: [] },
        { id: 4, title: 'Oferta de Empleo', candidates: [] }
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                if (!id) {
                    setError('ID de posición no proporcionado');
                    setLoading(false);
                    return;
                }
                const candidates = await getCandidatesForPosition(parseInt(id));
                
                // Distribuir candidatos en columnas según su currentInterviewStep
                const updatedColumns = columns.map(column => ({
                    ...column,
                    candidates: candidates.filter(
                        candidate => candidate.currentInterviewStep.id === column.id
                    )
                }));
                
                setColumns(updatedColumns);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los candidatos');
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [id]);

    const getScoreColor = (score) => {
        if (score >= 4) return 'success';
        if (score >= 3) return 'warning';
        return 'danger';
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container fluid className="kanban-container mt-4">
            <Row className="kanban-board">
                {columns.map(column => (
                    <Col key={column.id} className="kanban-column">
                        <Card className="column-card">
                            <Card.Header className="column-header">
                                {column.title}
                                <Badge bg="secondary" className="ms-2">
                                    {column.candidates.length}
                                </Badge>
                            </Card.Header>
                            <Card.Body className="column-body">
                                {column.candidates.map((candidate, index) => (
                                    <Card 
                                        key={index} 
                                        className="candidate-card mb-2"
                                    >
                                        <Card.Body>
                                            <Card.Title>{candidate.fullName}</Card.Title>
                                            {candidate.averageScore !== null && (
                                                <Badge 
                                                    bg={getScoreColor(candidate.averageScore)}
                                                    className="score-badge"
                                                >
                                                    {candidate.averageScore.toFixed(1)}
                                                </Badge>
                                            )}
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default KanbanBoard; 