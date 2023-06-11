import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { socket } from '../socket';
import { useSelector } from 'react-redux';

const NewMessageForm = () => {
  const { currentChannelId } = useSelector(state => state.channels);

  const validationSchema = yup.object().shape({
    body: yup.string().trim().required('Required'),
  });
  const inputRef = useRef(null);
  const f = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: ({ body }, { resetForm, setSubmitting }) => {
      socket.emit('newMessage', { body, channelId: currentChannelId });
      // сделать сброс стейста
      // f.resetForm();
      // f.resetForm({ body: '' });
      // resetForm();
      // setSubmitting(false);
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
          placeholder="Введите сообщение..."
          name="body"
          onChange={f.handleChange}
          className="border-0 p-0 ps-2"
          ref={inputRef}
        />
        {/* <Button variant="group-vertical" type="submit" disabled={isInvalid}> */}
        <Button variant="group-vertical" type="submit">
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">'sent'</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default NewMessageForm;
