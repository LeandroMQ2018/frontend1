import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

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
        const response = await fetch(`${API_URL}/api/usuarios/me`, {
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
        console.error('Error al autenticar:', error);
        navigate('/login');
      }
    };

    fetchUsuario();
  }, [navigate]);

  const cerrarSesion = async () => {
    try {
      await fetch(`${API_URL}/api/usuarios/cerrar-sesion`, {
        method: 'POST',
        credentials: 'include',
      });
      setUsuario(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
