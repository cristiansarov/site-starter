import React, { Component } from 'react';
import {connect} from 'core/decorators';
import { Modal } from 'react-bootstrap';
import { closeModal } from './ModalActions';
import './Modal.scss';

@connect(state=>({
  opened: state.modal.opened,
  config: state.modal.config || {}
}), {
  closeModal
})
export default class ModalComponent extends Component {
  render() {
    const { config: { content, className}, opened, closeModal } = this.props;
    return (
      <Modal show={opened} onHide={closeModal} className={className}>
        {content||'No content provided'}
      </Modal>
    )
  }
}