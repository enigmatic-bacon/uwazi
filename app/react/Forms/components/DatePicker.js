import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

import DatePickerComponent, { registerLocale } from 'react-datepicker';
import * as localization from 'date-fns/locale';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      asString : undefined,
      asInt : undefined,
    };
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
    this.options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
    registerLocale(props.locale || 'en', localization[props.locale] || localization.enGB);
    console.log('Locale: ', props.locale);

  }

  handleChange(datePickerValue) {
    //TODO add back endOfDay
    const { endOfDay, useTimezone, locale } = this.props;
    if (datePickerValue) {
      this.setState({
        asString: new Date(datePickerValue).toLocaleDateString(locale, this.options),
        asInt: datePickerValue
      })
    }
  }

  render() {
    const { locale, format, value, selected } = this.props;
    const defaultFormat = 'dd/MM/yyyy';
    return (
      <DatePickerComponent
        value={this.state.asString}
        className="form-control"
        onChange={this.handleChange}
        selected={value}
        locale={locale}
        placeholderText={format || defaultFormat}
        popperProps={{ strategy: 'fixed' }}
        isClearable
        fixedHeight
        showYearDropdown
      />
    );
  }
}

DatePicker.defaultProps = {
  value: undefined,
  endOfDay: false,
  locale: 'en',
  format: 'dd/MM/yyyy',
  useTimezone: false,
  
  selected: undefined,
  startDate: undefined,
  endDate: undefined,
  selectsStart: false,
  selectsEnd: false,
};

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number,
  endOfDay: PropTypes.bool,
  locale: PropTypes.string,
  format: PropTypes.string,
  useTimezone: PropTypes.bool,

  selected: PropTypes.number,
  startDate: PropTypes.number,
  endDate: PropTypes.number,
  selectsStart: PropTypes.bool,
  selectsEnd: PropTypes.bool,
};

export default connect()(DatePicker);
