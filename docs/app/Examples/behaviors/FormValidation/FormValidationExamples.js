import React, {Component} from 'react';
import FormValidationUsageExamples from './Usage/FormValidationUsageExamples';
import FormValidationRulesExamples from './Rules/FormValidationRulesExamples';
import FormValidationManipulatingFormsExamples from './ManipulatingForms/FormValidationManipulatingFormsExamples';

export default class FormValidationExamples extends Component {
  render() {
    return (
      <div>
        <FormValidationUsageExamples />
        <FormValidationRulesExamples />
        <FormValidationManipulatingFormsExamples />
      </div>
    );
  }
}
