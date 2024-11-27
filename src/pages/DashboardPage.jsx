import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [tareas, setTareas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/tareas/estudiante', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener las tareas.');
        }

        const data = await response.json();
        setTareas(data);
      } catch (error) {
        
        navigate('/login');
      }
    };

    fetchTareas();
  }, [navigate]);

  const marcarTarea = async (id, estado) => {
    try {
      const response = await fetch(`http://localhost:4000/api/tareas/${id}/marcar`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
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

  const cerrarSesion = async () => {
    await fetch('http://localhost:4000/api/usuarios/cerrar-sesion', {
      method: 'POST',
      credentials: 'include',
    });
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
