import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function DashboardProfesorPage() {
  const [tareas, setTareas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [editandoTarea, setEditandoTarea] = useState(null);
  const [nota, setNota] = useState('');
  const navigate = useNavigate();

  // Fetch inicial de tareas y estudiantes
  useEffect(() => {
    fetchTareas();
    fetchEstudiantes();
  }, []);

  // Obtener tareas
  const fetchTareas = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token de localStorage

      const response = await fetch(`${API_URL}/api/tareas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar token al encabezado
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener las tareas.');
      }

      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      navigate('/login'); // Redirigir si el token es inválido
    }
  };

  // Obtener lista de estudiantes
  const fetchEstudiantes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/usuarios/estudiantes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de estudiantes.');
      }

      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      alert(error.message);
    }
  };

  // Crear nueva tarea
  const crearTarea = async () => {
    if (!estudianteSeleccionado) {
      alert('Seleccione un estudiante.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tareas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, descripcion, estudiante: estudianteSeleccionado }),
      });

      if (!response.ok) {
        throw new Error('No se pudo crear la tarea.');
      }

      const data = await response.json();
      setTareas((prev) => [data.tarea, ...prev]);
      setTitulo('');
      setDescripcion('');
      setEstudianteSeleccionado('');
    } catch (error) {
      alert(error.message);
    }
  };

  // Iniciar edición de tarea
  const iniciarEdicion = (tarea) => {
    setEditandoTarea(tarea);
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setEstudianteSeleccionado(tarea.estudiante._id);
  };

  // Cancelar edición de tarea
  const cancelarEdicion = () => {
    setEditandoTarea(null);
    setTitulo('');
    setDescripcion('');
    setEstudianteSeleccionado('');
  };

  // Actualizar tarea existente
  const actualizarTarea = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tareas/${editandoTarea._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la tarea.');
      }

      const data = await response.json();
      setTareas((prev) =>
        prev.map((tarea) =>
          tarea._id === editandoTarea._id ? data.tarea : tarea
        )
      );
      cancelarEdicion();
    } catch (error) {
      alert(error.message);
    }
  };

  // Asignar nota a tarea
  const asignarNota = async (tareaId) => {
    if (!nota || isNaN(nota) || nota < 0 || nota > 100) {
      alert('Por favor ingrese una nota válida entre 0 y 100');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tareas/${tareaId}/asignar-nota`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nota: Number(nota) }),
      });

      if (!response.ok) {
        throw new Error('No se pudo asignar la nota.');
      }

      const data = await response.json();
      setTareas((prev) =>
        prev.map((tarea) =>
          tarea._id === tareaId ? data.tarea : tarea
        )
      );
      setNota('');
    } catch (error) {
      alert(error.message);
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/tareas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la tarea.');
      }

      setTareas((prev) => prev.filter((tarea) => tarea._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  // Cerrar sesión
  const cerrarSesion = async () => {
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Tareas</h1>
        <button
          onClick={cerrarSesion}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editandoTarea ? 'Editar Tarea' : 'Crear Tarea'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded h-32"
          ></textarea>
          <select
            value={estudianteSeleccionado}
            onChange={(e) => setEstudianteSeleccionado(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={editandoTarea}
          >
            <option value="">Seleccione un estudiante</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante._id} value={estudiante._id}>
                {estudiante.nombre}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {editandoTarea ? (
              <>
                <button
                  onClick={actualizarTarea}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={cancelarEdicion}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={crearTarea}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Crear Tarea
              </button>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Lista de Tareas</h2>
      <div className="space-y-4">
        {tareas.map((tarea) => (
          <div key={tarea._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{tarea.titulo}</h3>
                <p className="text-gray-600">{tarea.descripcion}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => iniciarEdicion(tarea)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarTarea(tarea._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Estado: {tarea.estado}</p>
              <p>Estudiante: {tarea.estudiante.nombre}</p>
              <p>Nota actual: {tarea.nota || 'No asignada'}</p>
            </div>
            {tarea.estado === 'entregado' && (
              <div className="mt-4">
                <input
                  type="number"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Asignar nota"
                />
                <button
                  onClick={() => asignarNota(tarea._id)}
                  className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
                >
                  Asignar Nota
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardProfesorPage;
