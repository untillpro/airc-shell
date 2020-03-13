/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import { string, object }  from 'yup';

const LoginSchema = object().shape({
  login: string().required('Enter login'),
  password: string().required('Enter password')
});

export default LoginSchema;