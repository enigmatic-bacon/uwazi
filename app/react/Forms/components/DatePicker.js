import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

import DatePickerComponent, { registerLocale } from 'react-datepicker';
import * as localization from 'date-fns/locale';
import toEndOfDay from 'date-fns/endOfDay';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
    //TODO add back endOfDay and timezone offset https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    const { endOfDay, useTimezone, locale, onChange } = this.props;
    //ex: Nov 29 2022 00:00:00 GMT-0500 (Eastern Standard Time)
    const date = new Date(datePickerValue)
    if (!useTimezone) {
      //getTimezoneOffset returns the difference, in minutes (need to convert to ms)
      date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000)
    }
    // toEndOfDay(new Date(datePickerValue))
    if (!datePickerValue) {
      //test should return empty value
      onChange(null);
    } else {
      this.setState({
        //ex: 11/29/2022
        asString: new Date(date).toLocaleDateString(locale, this.options),
        //ex: 1669698000000
        asInt: date.getTime()
      });
      //test should set the value to timestamp NOT offsetting to UTC
      onChange(date.getTime());
    }
  }

  render() {
    const { locale, format } = this.props;
    console.log('format', format);
    const { startDate, endDate, minDate, selectsStart, selectsEnd } = this.props;
    //Do we want to have something like this? https://stackoverflow.com/questions/2388115/get-locale-short-date-format-using-javascript
    const defaultFormat = 'dd/MM/yyyy';
    return (
      <DatePickerComponent
        format={format}
        value={this.state.asString}
        className="form-control"
        onChange={this.handleChange}
        selected={this.state.asInt}
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
