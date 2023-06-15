import React, { useContext, useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import SocketContext from '../contexts/SocketContext';
import { toast } from 'react-toastify';

const NewMessageForm = () => {
  const { currentChannelId } = useSelector(state => state.channels);
  const { t } = useTranslation();
  const validationSchema = yup.object().shape({
    body: yup.string().trim().required('modals.required'),
  });
  const inputRef = useRef(null);
  const { api } = useContext(SocketContext);

  const f = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }) => {
      const filteredName = leoProfanity.clean(body);
      try {
        await api.newMessage({ body: filteredName, channelId: currentChannelId });
        f.resetForm();
      } catch (error) {
        toast.error(t('error.networks'));
      }

      f.setSubmitting(false);
    },
    validateOnBlur: false,
  });

  const isInvalid = !f.dirty || !f.isValid;

  useEffect(() => {
    if (f.isSubmitting === false) {
      inputRef.current.focus();
    }
  }, [currentChannelId, f.isSubmitting]);
  return (
    <Form noValidate onSubmit={f.handleSubmit} className="py-1 border rounded-2">
      <InputGroup hasValidation={isInvalid}>
        <Form.Control
          placeholder={t('chat.enterMessage')}
          onChange={f.handleChange}
          onBlur={f.handleBlur}
          value={f.values.body}
          name="body"
          // aria-label={t('chat.newMessage')}
          disabled={f.isSubmitting}
          className="border-0 p-0 ps-2"
          ref={inputRef}
        />
        <Button variant="group-vertical" type="submit" disabled={isInvalid}>
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">{t('chat.sent')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default NewMessageForm;
