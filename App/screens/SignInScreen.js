import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
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
import DropdownAlert from 'react-native-dropdownalert';

import Auth0Api from '../../Api/Auth0Api';
import AuthTokenActions from '../../Flux/AuthTokenActions';

class SignInScreen extends React.Component {
  static getDataProps(data) {
    return {
      authTokens: data.authTokens,
    };
  };

  _handleSubmit = async (values, dispatch) => {
    try {
      let result = await Auth0Api.signInAsync(
        values.get('username'), values.get('password'));
      if (this._isMounted) {
        if (result.error) {
          this._handleError(result);
        } else {
          dispatch(AuthTokenActions.signIn({
            refreshToken: result.refresh_token,
            accessToken: result.access_token,
            idToken: result.id_token,
          }));
        }
      }
    } catch (e) {
      this._isMounted && this._handleError(e);
    }
  };

  _handleError = (error) => {
    console.log({ error });
    const message = error.error_description
      || error.message
      || 'Sorry, something went wrong.';
    this.dropdown.alertWithType('error', 'Error', message);
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authTokens.idToken && !this.props.authTokens.idToken) {
      this.props.navigation.goBack(null);
    }
  }

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
            onPress={handleSubmit(this._handleSubmit)}
            submitting={submitting}
            >Sign In</Button>
        </ActionsContainer>
        <DropdownAlert
          containerStyle={{
            padding: 0,
            paddingTop: 0,
          }}
          ref={(ref) => this.dropdown = ref}/>
      </Form>
    )
  }
}

export default connect((data) => SignInScreen.getDataProps(data))(reduxForm({
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
})(SignInScreen));
