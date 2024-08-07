import React from 'react';
import SuccessAlert from '../molecules/success-alert';
import ErrorAlert from '../molecules/error-alert';
import DeleteAlert from '../molecules/delete-alert';

const AlertWrapper = ({ type, message }) => {
  switch (type) {
    case 'success':
      return <SuccessAlert message={message} />;
    case 'error':
      return <ErrorAlert message={message} />;
    case 'delete':
      return <DeleteAlert message={message} />;
    default:
      return null;
  }
};

export default AlertWrapper;
