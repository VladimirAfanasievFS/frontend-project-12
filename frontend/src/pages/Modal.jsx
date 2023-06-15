import { useContext, useEffect, useRef } from 'react';
import { Button, Modal as BootstrapModal, Form, FormGroup, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import find from 'lodash/find';
import { useTranslation } from 'react-i18next';

import { hideModal } from '../slices/modal';
import SocketContext from '../contexts/SocketContext';
export const TYPE = { ADD: 'add', REMOVE: 'remove', RENAME: 'rename' };

const AddChannelModal = ({ handleClose }) => {
  const { channels } = useSelector(state => state.channels);
  const { t } = useTranslation();
  const { api } = useContext(SocketContext);
  const f = useFormik({
    onSubmit: async values => {
      const filteredName = leoProfanity.clean(values.body);
      try {
        await api.newChannel({ name: filteredName });
        toast.success(t('channels.created'));
        handleClose();
      } catch {
        toast.error(t('error.networks'));
      }

      f.setSubmitting(false);
    },
    initialValues: { body: '' },
    validationSchema: Yup.object().shape({
      body: Yup.string()
        .trim()
        .required('modals.required')
        .min(3, 'modals.min')
        .max(20, 'modals.max')
        .notOneOf(
          channels.map(({ name }) => name),
          'modals.uniq',
        ),
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
        <BootstrapModal.Title>{t('modals.add')}</BootstrapModal.Title>
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
              placeholder={t('modals.channelName')}
            />
            <label className="visually-hidden" htmlFor="body">
              {t('modals.channelName')}
            </label>
            <Form.Control.Feedback type="invalid">{t(f.errors.body)}</Form.Control.Feedback>
          </FormGroup>
          <Button type="submit" className="btn btn-primary">
            {t('modals.submit')}
          </Button>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};
const RemoveChannelModal = ({ handleClose }) => {
  const { id } = useSelector(state => state.modal.payload);
  const { t } = useTranslation();
  const { api } = useContext(SocketContext);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await api.removeChannel({ id });
      toast.success(t('channels.removed'));
      handleClose();
    } catch {
      toast.error(t('error.networks'));
    }
  };

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('modals.remove')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={handleSubmit}>
          <div>{t('modals.confirmation')}</div>
          <Button type="submit" className="btn btn-primary">
            {t('modals.confirm')}
          </Button>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const RenameChannelModal = ({ handleClose }) => {
  const { id } = useSelector(state => state.modal.payload);
  const channels = useSelector(state => state.channels.channels);
  const { t } = useTranslation();
  const { api } = useContext(SocketContext);

  const channel = find(channels, channel => channel.id === id);

  const f = useFormik({
    onSubmit: async values => {
      try {
        await api.renameChannel({ id, name: values.body });
        toast.success(t('channels.renamed'));
        handleClose();
      } catch {
        toast.error(t('error.networks'));
      }
    },
    initialValues: { body: channel?.name },
    validationSchema: Yup.object().shape({
      body: Yup.string()
        .trim()
        .required('modals.required')
        .min(3, 'modals.min')
        .max(20, 'modals.max')
        .notOneOf(
          channels.map(({ name }) => name),
          'modals.uniq',
        ),
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
        <BootstrapModal.Title>{t('modals.rename')}</BootstrapModal.Title>
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
              id="body"
              isInvalid={f.errors.body && f.touched.body}
            />
            <label className="visually-hidden" htmlFor="body">
              {t('modals.channelName')}
            </label>
            <Form.Control.Feedback type="invalid">{t(f.errors.body)}</Form.Control.Feedback>
          </FormGroup>
          <Button type="submit" className="btn btn-primary">
            {t('modals.submit')}
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
