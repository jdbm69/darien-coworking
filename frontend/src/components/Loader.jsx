// src/app/components/Loader.jsx
// Componente de carga 

export default function Loader() {

  return (
    <div className="overlay">
        <div className='load-cont'>
            <div className="load" />
            <p className="load-text">Cargando</p>
            </div>
    </div>
  );
}