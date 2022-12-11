import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

import DatePickerComponent, { registerLocale } from 'react-datepicker';
import * as localization from 'date-fns/locale';
import toEndOfDay from 'date-fns/endOfDay';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const removeOffset = (useTimezone, value) => {
  let datePickerValue = null;
  const miliseconds = value * 1000;
  if (value) {
    const newValue = moment.utc(miliseconds);

    if (!useTimezone) {
      // in order to get the system offset for the specific date we
      // need to create a new not UTC moment object with the original timestamp
      newValue.subtract(moment(moment(miliseconds)).utcOffset(), 'minutes');
    }

    datePickerValue = parseInt(newValue.locale('en').format('x'), 10);
  }

  return datePickerValue;
};

const addOffset = (useTimezone, endOfDay, value) => {
  const newValue = moment.utc(value);

  if (!useTimezone) {
    // in order to get the proper offset moment has to be initialized with the actual date
    // without this you always get the "now" moment offset
    newValue.add(moment(value).utcOffset(), 'minutes');
  }

  if (endOfDay) {
    const method = useTimezone ? newValue.local() : newValue.utc();
    method.endOf('day');
  }

  return newValue;
};

//Moment.js is now a legacy project so I'm moving away from it https://momentjs.com/docs/ 
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
  }

  handleChange(datePickerValue) {
    const { endOfDay, useTimezone, onChange } = this.props;

    if (!datePickerValue) {
      onChange(null);
    } else {
      const newValue = addOffset(useTimezone, endOfDay, datePickerValue);
      onChange(parseInt(newValue.locale('en').format('X'), 10));
    }
  }

  render() {
    const { locale, format, useTimezone } = this.props;
    // console.log('format', format);
    const { startDate, endDate, minDate, selectsStart, selectsEnd, value } = this.props;
    //Do we want to have something like this? https://stackoverflow.com/questions/2388115/get-locale-short-date-format-using-javascript
    const defaultFormat = 'dd/MM/yyyy';
    const datePickerValue = removeOffset(useTimezone, value);
    return (
      <DatePickerComponent
        dateFormat={format || defaultFormat}
        className="form-control"
        onChange={this.handleChange}
        selected={datePickerValue}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
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
  
  startDate: undefined,
  endDate: undefined,
  minDate: undefined,
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

  startDate: PropTypes.number,
  endDate: PropTypes.number,
  minDate: PropTypes.number,
  selectsStart: PropTypes.bool,
  selectsEnd: PropTypes.bool,
};

export default connect()(DatePicker);
