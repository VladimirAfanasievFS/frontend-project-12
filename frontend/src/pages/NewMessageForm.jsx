// @ts-check

import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as yup from 'yup';

const NewMessageForm = () => {
  const validationSchema = yup.object().shape({
    body: yup.string().trim().required('Required'),
  });

  const f = useFormik({
    initialValues: { body: '' },
    validationSchema,
    onSubmit: async ({ body }) => {},
    validateOnBlur: false,
  });

  const isInvalid = !f.dirty || !f.isValid;

  return (
    <Form noValidate onSubmit={f.handleSubmit} className="py-1 border rounded-2">
      <InputGroup hasValidation={isInvalid}>
        <Form.Control placeholder="Введите сообщение..." className="border-0 p-0 ps-2" />
        <Button variant="group-vertical" type="submit" disabled={isInvalid}>
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">'sent'</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default NewMessageForm;
