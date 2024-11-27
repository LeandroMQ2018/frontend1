import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirección

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('estudiante');
  const navigate = useNavigate(); // Hook para redirección

  const manejarRegistro = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('https://backend1-mgcr.onrender.com/api/usuarios/registrar', { // Cambiar URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, correo, contraseña, rol }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al registrar usuario');
    }

    alert('Usuario registrado con éxito.');
    navigate('/login');
  } catch (error) {
    alert(error.message);
  }
};
  

  return (
    <div>
      <h1>Registrar Usuario</h1>
      <form onSubmit={manejarRegistro}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
        </select>
        <button type="submit">Registrar</button>
      </form>
      <p>
        ¿Ya tienes una cuenta?{' '}
        <button onClick={() => navigate('/login')} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </p>
    </div>
  );
}

export default RegisterPage;
