import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await fetch(`${API_URL}/api/usuarios/iniciar-sesion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, contraseña }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al iniciar sesión');
    }

    const data = await response.json();

    if (data.usuario.rol === 'profesor') {
      navigate('/dashboard-profesor');
    } else {
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Error:', error.message);
    setError(error.message);
  }
};



  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={manejarLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Ingresar
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        ¿No tienes una cuenta?{' '}
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:underline"
        >
          ¡Regístrate aquí!
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
