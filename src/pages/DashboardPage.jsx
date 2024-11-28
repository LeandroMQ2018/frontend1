import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function DashboardPage() {
  const [tareas, setTareas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No hay token de autenticación.');
        }

        const response = await fetch(`${API_URL}/api/tareas/estudiante`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener las tareas.');
        }

        const data = await response.json();
        setTareas(data);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
        navigate('/login');
      }
    };

    fetchTareas();
  }, [navigate]);

  const marcarTarea = async (id, estado) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/tareas/${id}/marcar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la tarea.');
      }

      const data = await response.json();
      setTareas((prev) => prev.map((t) => (t._id === id ? data.tarea : t)));
    } catch (error) {
      alert(error.message);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Tareas Asignadas</h1>
      <button onClick={cerrarSesion}>Cerrar Sesión</button>
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea._id}>
            <strong>{tarea.titulo}</strong> - {tarea.descripcion}
            <br />
            Estado: {tarea.estado}
            <br />
            Profesor: {tarea.profesor.nombre}
            <button onClick={() => marcarTarea(tarea._id, tarea.estado === 'pendiente' ? 'entregado' : 'pendiente')}>
              Marcar como {tarea.estado === 'pendiente' ? 'Entregado' : 'Pendiente'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;
