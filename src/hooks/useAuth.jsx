// src/hooks/useAuth.jsx - Versión corregida

import { useEffect, useState } from "react";
import { oferentesAPI } from "../services/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("currentUser");

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('📦 User data from localStorage:', userData);

        // 👈 Si es oferente, buscar TODOS sus negocios
        if (userData.rol === 'oferente') {
          console.log('🔍 Buscando negocios para el oferente ID:', userData.id_usuario);
          
          try {
            // Obtener TODOS los oferentes
            const response = await oferentesAPI.getAll();
            
            console.log('📡 Respuesta de oferentesAPI:', response);
            
            const todosNegocios = response?.oferentes || [];
            
            // Filtrar SOLO los negocios del usuario actual
            const misNegocios = todosNegocios.filter(negocio => negocio.id_usuario === userData.id_usuario);
            
            console.log('📡 Lista de negocios encontrados:', misNegocios);
            
            if (misNegocios && misNegocios.length > 0) {
              // 👈 GUARDAR LA LISTA COMPLETA DE NEGOCIOS
              userData.negocios = misNegocios;
              
              // Tomar el primer negocio como principal (opcional)
              const primerNegocio = misNegocios[0];
              userData.id_oferente = primerNegocio.id_oferente;
              userData.nombre_negocio = primerNegocio.nombre_negocio;
              userData.tipo_negocio = primerNegocio.tipo;
              
              // Actualizar localStorage con los nuevos datos
              localStorage.setItem('currentUser', JSON.stringify(userData));
              console.log('✅ Negocios guardados:', misNegocios.map(n => ({ id: n.id_oferente, nombre: n.nombre_negocio })));
            } else {
              console.warn('⚠️ El oferente no tiene ningún negocio registrado');
              userData.id_oferente = null;
              userData.negocios = [];
            }
          } catch (error) {
            console.error('❌ Error fetching oferente data:', error);
            userData.id_oferente = null;
            userData.negocios = [];
          }
        }
        
        // Asegurar que el objeto user tenga la propiedad 'id'
        setUser({
          ...userData,
          id: userData.id_usuario,  // Para compatibilidad con ReviewCard
        });
      }
      setLoading(false);
    };
    
    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const isLoggedIn = !!user;
  const isTurista = user?.rol === 'turista';
  const isOferente = user?.rol === 'oferente';
  const isAdmin = user?.rol === 'admin';

  return { 
    user, 
    loading, 
    logout, 
    isLoggedIn,
    isTurista,
    isOferente,
    isAdmin
  };
}