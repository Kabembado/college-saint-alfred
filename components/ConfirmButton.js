'use client';

/** Bouton d'envoi qui demande une confirmation (ex. suppression). */
export default function ConfirmButton({ message = 'Confirmer la suppression ?', className = 'btn btn-danger btn-small', children }) {
  return (
    <button
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children || 'Supprimer'}
    </button>
  );
}
