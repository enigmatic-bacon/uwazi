import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Translate } from 'app/I18N';
import DatePicker from './DatePicker';
import DatePickerComponent, { registerLocale } from 'react-datepicker';

class DateRange extends Component {
  constructor(props){
    super(props);
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
    this.state = {
      startDate: undefined,
      endDate: undefined,
    };
    console.log("Constructor:", this)
  }

  render(){
    return (
      <div>
        <div className="DatePicker__From">
          <span className="truncate">
            <Translate translationKey='Label date "From"'>From:</Translate>
          </span>
          <DatePicker
            selected={this.state.startDate}
            onChange={this.onChangeStart}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        </div>
          <div className="DatePicker__To">
            <span className="truncate">
              <Translate translationKey='Label date "to"'>To:</Translate>
            </span>
          <DatePicker
            selected={this.state.endDate}
            onChange={this.onChangeEnd}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        </div>
      </div>
    );
  }

  onChangeStart(value){
    console.log('Start Change:', value);
    console.log('Start Date:', new Date(value));
    this.setState({startDate: value})
  }

  onChangeEnd(value){
    console.log('End Change:', value);
    console.log('End Date:', new Date(value));
    this.setState({endDate: value})
  }
}  
export default DateRange;

// class DateRange extends Component {
//   onChangeFrom(propValue) {
//     const { value, onChange } = this.props;
//     const state = { ...value, from: propValue };
//     console.log(state);
//     onChange(state);
//   }

//   onChangeTo(propValue) {
//     const { value, onChange } = this.props;
//     const state = { ...value, to: propValue };
//     console.log(state);

//     onChange(state);
//   }

//   render() {
//     const { useTimezone, locale, format } = this.props;
//     const { value } = this.props;
//     const { from: stateFrom, to: stateTo } = value || { from: null, to: null };
//     console.log('Date Range', this);
//     console.log('Date Range', stateFrom);
//     console.log('Date Range', new Date(stateFrom),  new Date(stateTo));
//     return (
//       <div>
//         <div className="DatePicker__From">
//           <span className="truncate">
//             <Translate translationKey='Label date "From"'>From:</Translate>
//           </span>
//           <DatePicker
//             locale={locale}
//             format={format}
//             useTimezone={useTimezone}
//             value={stateFrom}
//             onChange={val => this.onChangeFrom (val)}
//             startDate={new Date(stateFrom)}
//             selectsStart
//           />
//         </div>
//         <div className="DatePicker__To">
//           <span className="truncate">
//             <Translate translationKey='Label date "to"'>To:</Translate>
//           </span>
//           <DatePicker
//             locale={locale}
//             format={format}
//             useTimezone={useTimezone}
//             value={stateTo}
//             endOfDay
//             onChange={val => this.onChangeTo(val)}
//             endDate={new Date(stateTo)}
//             selectsEnd
//           />
//         </div>
//       </div>
//     );
//   }
// }

// DateRange.defaultProps = {
//   value: { from: null, to: null },
//   onChange: () => {},
//   locale: undefined,
//   format: undefined,
//   useTimezone: false,
// };

// DateRange.propTypes = {
//   value: PropTypes.shape({ from: PropTypes.instanceOf(Date), to: PropTypes.instanceOf(Date) }),
//   onChange: PropTypes.func,
//   locale: PropTypes.string,
//   format: PropTypes.string,
//   useTimezone: PropTypes.bool,
// };

//export default DateRange;
