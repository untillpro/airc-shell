/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import LoginSchema from 'schemas/LoginSchema';

import {
    Form,
    FormRow,
    TextInput,
    Label,
    FormButton
} from 'base/components';

import {
    doAuth
} from 'actions';

class RegisterForm extends Component {
    submitForm(values) {
        const { login, password } = values;

        this.props.doAuth(login, password, true);
    }

    forgotPassword() {
        this.props.showForgotModal();
    }

    render() {
        return (
            <div className="ushell-login-block-form">
                <div className="ushell-login-block-form-title">
                    New user registration
                </div>
                <Formik
                    initialValues={{ 
                        login: '', 
                        password: '' 
                    }}
                    
                    validationSchema={LoginSchema}

                    onSubmit={(values, { setSubmitting }) => {
                        this.submitForm(values);

                        setTimeout(() => {
                            setSubmitting(false);
                        }, 1000);
                    }}
                >
                    {
                        ({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) =>  {
                            return (<form onSubmit={handleSubmit}>
                                <Form>
                                    <FormRow>
                                        <Label 
                                            error={errors.login && touched.login && errors.login}
                                            text="Username"
                                        />

                                        <TextInput 
                                            error={errors.login && touched.login && errors.login}
                                            value={values.login}
                                            type="text"
                                            
                                            name="login"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
        
                                            placeholder="Username"
                                        />
                                    </FormRow>
        
                                    <FormRow>
                                        <Label 
                                            error={errors.login && touched.login && errors.login}
                                            text="Username"
                                        />

                                        <TextInput 
                                            error={errors.password && touched.password && errors.password}
                                            value={values.password}
                                            type="password"

                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Password"

                                        />
                                    </FormRow>
        
                                    <FormRow last>
                                        <FormButton 
                                            submit
                                            full
                                            text="Register"
                                            
                                            input={{
                                                onClick: handleSubmit,
                                                title: "Register",
                                                disabled: isSubmitting
                                            }}
                                        />
                                    </FormRow>
                                </Form>
                            </form>);
                        }
                    }
                </Formik>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps, {
    doAuth
})(RegisterForm);