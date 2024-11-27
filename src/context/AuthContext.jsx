import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config'; // Importar la URL base

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`${API_URL}/api/usuarios/me`, { // URL dinámica
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No autenticado');
        }

        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        navigate('/login'); // Redirige al login si no está autenticado
      }
    };

    fetchUsuario();
  }, [navigate]);

  const cerrarSesion = async () => {
    await fetch(`${API_URL}/api/usuarios/cerrar-sesion`, { // URL dinámica
      method: 'POST',
      credentials: 'include',
    });
    setUsuario(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
