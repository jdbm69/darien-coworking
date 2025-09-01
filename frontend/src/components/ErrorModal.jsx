// src/app/components/ErrorModal.jsx
// Componente de modal de error 

export default function ErrorModal({ msg, setShowModal, setMsg }) {

  const handleClose = () => {
    setMsg('');
    setShowModal(false);
  }

  return (
    <div className="overlay">
        <div className='modal-cont'>
            <p className={`alert ${msg.startsWith("⚠️") ? "alert--danger" : ""}`}>{msg}</p>
            <button className="btn" onClick={handleClose}>Cerrar</button>
        </div>
    </div>
  );
}