import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import '../styles/ReservaModal.css'; // Let's reuse existing modal stylings

function ConfirmModal({ isOpen, title, message, onConfirm, onClose, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        
        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isDestructive && <AlertTriangle size={24} style={{ color: '#ff4d4f' }} />}
              {!isDestructive && <AlertTriangle size={24} style={{ color: '#faad14' }} />}
              {title}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ color: '#ccc', marginBottom: '24px', lineHeight: '1.6', fontSize: '16px' }}>
            {message}
          </p>

          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ minWidth: '100px' }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
              onClick={onConfirm}
              style={{ minWidth: '100px' }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
