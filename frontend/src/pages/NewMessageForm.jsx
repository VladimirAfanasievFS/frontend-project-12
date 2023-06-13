import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { socket } from '../socket';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const NewMessageForm = () => {
  const { currentChannelId } = useSelector(state => state.channels);
  const { t } = useTranslation();
  const validationSchema = yup.object().shape({
    body: yup.string().trim().required('Required'),
  });
  const inputRef = useRef(null);
  const f = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: ({ body }, { resetForm, setSubmitting }) => {
      socket.emit('newMessage', { body, channelId: currentChannelId });
      resetForm();
      setSubmitting(false);
      inputRef.current.focus();
    },
    validateOnBlur: false,
  });

  const isInvalid = !f.dirty || !f.isValid;

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId]);

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
