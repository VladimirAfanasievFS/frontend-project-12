import { useEffect, useRef, useState } from 'react';
import { Button, Modal as BootstrapModal, Form, FormGroup, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../slices/modal';
import { useFormik } from 'formik';
import { socket } from '../socket';
import * as Yup from 'yup';
import find from 'lodash/find';

export const TYPE = { ADD: 'add', REMOVE: 'remove', RENAME: 'rename' };

const AddChannelModal = ({ handleClose }) => {
  const { channels } = useSelector(state => state.channels);

  const f = useFormik({
    onSubmit: async values => {
      socket.emit('newChannel', { name: values.body }, ({ status }) => {
        if (status === 'ok') {
          handleClose();
        } else {
          console.warn('newChannel EROROROR');
        }
      });
    },
    initialValues: { body: '' },
    validationSchema: Yup.object().shape({
      body: Yup.string()
        .min(3, 'Too Short!')
        .max(10, 'Too Long!')
        .notOneOf(channels.map(({ name }) => name))
        .required('Required!'),
    }),
    validateOnBlur: false,
    validateOnChange: false,
  });
  console.log('🚀 ~ file: Modal.jsx:35 ~ AddChannelModal ~ f:', f);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
    // f.setFieldError('body', false);
  }, []);

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Add new channel</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <FormGroup className="mb-2">
            <FormControl
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.body}
              name="body"
              isInvalid={!!f.errors.body}
            />
            <Form.Control.Feedback type="invalid">{f.errors.body}</Form.Control.Feedback>
          </FormGroup>
          <Button disabled={f.errors.body} type="submit" className="btn btn-primary">
            Confirm add channel
          </Button>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};
const RemoveChannelModal = ({ handleClose }) => {
  const { id } = useSelector(state => state.modal.payload);

  const handleSubmit = async e => {
    e.preventDefault();

    socket.emit('removeChannel', { id }, ({ status }) => {
      if (status === 'ok') {
        handleClose();
      } else {
        console.warn('removeChannel EROROROR');
      }
    });
  };

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Remove channel</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={handleSubmit}>
          <Button type="submit" className="btn btn-primary">
            Confirm remove channel
          </Button>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const RenameChannelModal = ({ handleClose }) => {
  const { id } = useSelector(state => state.modal.payload);
  const channels = useSelector(state => state.channels.channels);

  const channel = find(channels, channel => channel.id === id);

  const f = useFormik({
    onSubmit: async values => {
      socket.emit('renameChannel', { id, name: values.body }, ({ status }) => {
        if (status === 'ok') {
          handleClose();
        } else {
          console.warn('renameChannel EROROROR');
        }
      });
    },
    initialValues: { body: channel?.name },
    validationSchema: Yup.object().shape({
      body: Yup.string()
        .min(3, 'Too Short!')
        .max(10, 'Too Long!')
        .notOneOf(channels.map(({ name }) => name))
        .required('Required!'),
    }),
    validateOnBlur: false,
    validateOnChange: false,
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Rename channel</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <FormGroup className="mb-2">
            <FormControl
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.body}
              name="body"
              isInvalid={f.errors.body && f.touched.body}
            />
            <Form.Control.Feedback type="invalid">{f.errors.body}</Form.Control.Feedback>
          </FormGroup>
          <Button type="submit" className="btn btn-primary">
            Confirm rename channel
          </Button>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const modalsType = {
  [TYPE.ADD]: AddChannelModal,
  [TYPE.REMOVE]: RemoveChannelModal,
  [TYPE.RENAME]: RenameChannelModal,
};
const Modal = () => {
  const dispatch = useDispatch();

  const { isVisible, type } = useSelector(state => ({
    isVisible: state.modal.isVisible,
    type: state.modal.type,
  }));

  const handleClose = () => {
    dispatch(hideModal());
  };

  const ModalComponent = modalsType[type];
  return (
    <BootstrapModal show={isVisible} onHide={handleClose}>
      {ModalComponent && <ModalComponent handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;
