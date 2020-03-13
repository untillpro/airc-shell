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
    Label,
    TextInput,
    Link,
    FormButton
} from 'base/components';

import {
    doAuth,
    showForgotModal
} from 'actions';

class LoginForm extends Component {
    submitForm(values) {
        const { login, password } = values;

        this.props.doAuth(login, password);
    }

    forgotPassword() {
        this.props.showForgotModal();
    }

    render() {
        return (
            <div className="ushell-login-block-form">
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
                                            placeholder="Username"
                                            name="login"
                                            onChange={handleChange}
                                            value={values.login}
                                            type="text"
                                        />
                                    </FormRow>
        
                                    <FormRow>
                                        <Label 
                                            error={errors.password && touched.password && errors.password}
                                            text="Password"
                                            right={
                                                <Link 
                                                    href="#forgot"
                                                    text="Forgot password?"
                                                    onClick={this.forgotPassword.bind(this)}
                                                    className="forgot_link"
                                                />
                                            }
                                        />
                                        <TextInput 
                                            placeholder="Password"
                                            value={values.password}
                                            name="password"
                                            onChange={handleChange}
                                            label="Password"
                                            type="password"
                                        />
                                    </FormRow>
        
                                    <FormRow last>
                                        <FormButton 
                                            submit
                                            full
                                            text="Sign in"
                                            
                                            input={{
                                                onClick: handleSubmit,
                                                tabIndex: 3,
                                                title: "Sign in",
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
    doAuth, 
    showForgotModal 
})(LoginForm);