import { useEffect, useRef, useState } from 'react';
import { Button, Modal as BootstrapModal, Form, FormGroup, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { hideModal } from '../slices/modal';
import { useFormik } from 'formik';
import { socket } from '../socket';
import * as Yup from 'yup';
import { removeChannel } from '../slices/channels';

export const TYPE = { ADD: 'add', REMOVE: 'remove', RENAME: 'rename' };

const AddChannelModal = ({ handleClose }) => {
  const { currentChannelId, channels } = useSelector(state => state.channels);

  const f = useFormik({
    onSubmit: async values => {
      try {
        socket.emit('newChannel', { name: values.body }, ({ status }) => {
          if (status === 'ok') {
            handleClose();
          } else {
            console.warn('newChannel EROROROR');
          }
        });
        // const resultAction = await dispatch(asyncActions.postChannel({ name: `${values.body}` }));
        // unwrapResult(resultAction);
      } catch ({ message }) {
        // dispatch(
        //   actions.showModal({
        //     modalType: 'INFO_CHANNEL',
        //     modalProps: { message },
        //   }),
        // );
      }
    },
    initialValues: { body: '' },
    initialErrors: { body: 'Required' },
    validationSchema: Yup.object().shape({
      body: Yup.string()
        .min(3, 'Too Short!')
        .max(10, 'Too Long!')
        .notOneOf(channels.map(({ name }) => name))
        .required('Required!'),
    }),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Add new channel</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <FormGroup>
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
  const dispatch = useDispatch();
  const { id } = useSelector(state => state.modal.payload);
  // const handleHide = () => {
  //   dispatch(actions.hideModal());
  // };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      socket.emit('removeChannel', { id }, ({ status }) => {
        if (status === 'ok') {
          handleClose();
        } else {
          console.warn('removeChannel EROROROR');
        }
      });

    } catch ({ message }) {
      // dispatch(
      //   actions.showModal({
      //     modalType: 'INFO_CHANNEL',
      //     modalProps: { message },
      //   }),
      // );
    }
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

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  // const { channel } = useSelector(modalProps);
  // const handleHide = () => {
  //   dispatch(actions.hideModal());
  // };

  const f = useFormik({
    onSubmit: async values => {
      try {
        // const resultAction = await dispatch(
        //   asyncActions.renameChannel({ channelId: channel.id, name: `${values.body}` }),
        // );
        // unwrapResult(resultAction);
        // handleHide();
      } catch ({ message }) {
        // dispatch(
        //   actions.showModal({
        //     modalType: 'INFO_CHANNEL',
        //     modalProps: { message },
        //   }),
        // );
      }
    },
    // initialValues: { body: channel.name },
    // validationSchema: Yup.object().shape({
    //   body: Yup.string().min(3, 'Too Short!').max(10, 'Too Long!').required('Required!'),
    // }),
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Rename channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <FormGroup>
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
          <Button type="submit" className="btn btn-primary">
            Confirm rename channel
          </Button>
        </Form>
      </Modal.Body>
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
