import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { I18n } from 'react-redux-i18n';
import { closeModal } from './ModalActions';
import { reduxForm } from 'redux-form';


class ModalComponent extends Component {

  onButtonClick(button) {
    const { valid, closeModal } = this.props;
    if (valid) {
      button.onClick && button.onClick();
      closeModal();
    }
  }

  render() {
    const { config: { title = I18n.t('modal.genericTitle'), classTitle, content, component, buttons = [] } = {}, isOpened, params, closeModal, handleSubmit } = this.props;
    const Component = component;
    if (!buttons.length) buttons.push({display: I18n.t('button.ok')});
    return (
      <form>
        <Modal show={isOpened} onHide={closeModal.bind(this)} className="community-modal">
          { title && (
            <div className={classTitle}>
              <Modal.Header className='community-header'>
                <div onClick={closeModal.bind(this)} className="close-button-modal">
                  <img src="assets/images/modal/x.svg"/>
                </div>
                <Modal.Title className="title-modal">{title}</Modal.Title>
              </Modal.Header>
            </div>

          ) }
          <Modal.Body>
            { component ?
              <Component closeModal={closeModal.bind(this)} buttons={buttons} params={params || {}}/> : content }
          </Modal.Body>
          { buttons && (
            <Modal.Footer className="community-footer">
              { buttons.map((button, k)=>(
                <button key={k} type="submit"
                        onClick={handleSubmit(()=>this.onButtonClick(button))}>{button.display}</button>
              )) }
            </Modal.Footer>
          ) }
        </Modal>
      </form>
    )
  }
}

ModalComponent = reduxForm({form: 'ModalForm'})(ModalComponent);
export default connect(state=>({
  isOpened: state.modal.isOpened,
  config: state.modal.config,
  params: state.modal.params
}), {
  closeModal
})(ModalComponent);
