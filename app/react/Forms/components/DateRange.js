import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Translate } from 'app/I18N';
import DatePicker from './DatePicker';

class DateRange extends Component {
  onChangeFrom(propValue) {
    const { value, onChange } = this.props;
    const state = { ...value, from: propValue };
    console.log('State: ', state);

    onChange(state);
  }

  onChangeTo(propValue) {
    const { value, onChange } = this.props;
    const state = { ...value, to: propValue };
    console.log('State: ', state);

    onChange(state);
  }

  render() {
    const { useTimezone, locale, format } = this.props;
    const { value } = this.props;
    const { from: stateFrom, to: stateTo } = value || { from: null, to: null };

    return (
      <div>
        <div className="DatePicker__From">
          <span className="truncate">
            <Translate translationKey='Label date "From"'>From:</Translate>
          </span>
          <DatePicker
            locale={locale}
            format={format}
            useTimezone={useTimezone}
            value={stateFrom}
            onChange={val => this.onChangeFrom (val)}
          />
        </div>
        <div className="DatePicker__To">
          <span className="truncate">
            <Translate translationKey='Label date "to"'>To:</Translate>
          </span>
          <DatePicker
            locale={locale}
            format={format}
            useTimezone={useTimezone}
            value={stateTo}
            endOfDay
            onChange={val => this.onChangeTo(val)}
          />
        </div>
      </div>
    );
  }
}

DateRange.defaultProps = {
  value: { from: null, to: null },
  onChange: () => {},
  locale: undefined,
  format: undefined,
  useTimezone: false,
};

DateRange.propTypes = {
  value: PropTypes.shape({ from: PropTypes.number, to: PropTypes.number }),
  onChange: PropTypes.func,
  locale: PropTypes.string,
  format: PropTypes.string,
  useTimezone: PropTypes.bool,
};

export default DateRange;
