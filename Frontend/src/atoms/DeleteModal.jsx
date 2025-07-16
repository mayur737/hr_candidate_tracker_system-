/* eslint-disable react/prop-types */
import deleteImg from '../assets/delete.svg';
const DeleteModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 50 }}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-center">
        <img src={deleteImg} alt="Illustration" className="mx-auto mb-4 w-32 h-32" />
        <h3 className="text-xl font-semibold text-primary">Are you sure?</h3>
        <p className="text-secondary mt-2">{message || 'Do you really want to delete this document?'}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button type="button" className="px-4 py-2 bg-red-100 text-red-600 font-medium border border-red-600 rounded-md hover:bg-red-600 hover:text-white" onClick={onConfirm}>
            Delete
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-100 text-primary-main font-medium border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
