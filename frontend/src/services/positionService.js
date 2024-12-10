import axios from 'axios';

export const getCandidatesForPosition = async (positionId) => {
    try {
        const response = await axios.get(`http://localhost:3010/positions/${positionId}/candidates`);
        return response.data.data;
    } catch (error) {
        throw new Error('Error al obtener los candidatos de la posición');
    }
}; 