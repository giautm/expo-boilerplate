import React from 'react';
import { View, Text } from 'react-native';
import { reduxForm } from 'redux-form/immutable';
import {
  ActionsContainer,
  Button,
  FieldsContainer,
  Fieldset,
  Form,
  FormGroup,
  Label,
} from 'react-native-clean-form'
import {
  Input,
  Select,
  Switch
} from 'react-native-clean-form/redux-form-immutable';

const onSubmit = (values, dispatch) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(values.toJS())
      resolve()
    }, 1500);
  });
};

class FormView extends React.Component {

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Form>
        <FieldsContainer>
          <Fieldset label="Sign in" last>
            <Input
              name="username"
              label="Username"
              placeholder="someone"/>
            <Input
              name="password"
              label="Password"
              placeholder="password"
              secureTextEntry/>
          </Fieldset>
        </FieldsContainer>
        <ActionsContainer>
          <Button
            iconPlacement="right"
            onPress={handleSubmit(onSubmit)}
            submitting={submitting}
            >Save</Button>
        </ActionsContainer>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'signInForm',
  validate: (values) => {
    const errors = {};
    if (!values.get('username')) {
      errors.username = 'Username is required.';
    }

    if (!values.get('password')) {
      errors.password = 'Password is required.';
    }

    return errors;
  },
})(FormView);
