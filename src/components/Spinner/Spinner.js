import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import styles from './Spinner.scss';

const Spinner = ({ canShow, messageId }) => {
  const className = `glyphicon glyphicon-refresh ${ styles.spinner }`;

  return (
    <Modal show={ canShow } bsSize="small">
      <Modal.Body>
        <i className={ className } />
        {canShow &&
          <FormattedMessage id={ messageId } defaultMessage="Please wait..." />
        }
      </Modal.Body>
    </Modal>
  );
};

Spinner.displayName = 'Spinner';
Spinner.propTypes = {
  canShow: PropTypes.bool.isRequired,
  messageId: PropTypes.string,
};

export default Spinner;
