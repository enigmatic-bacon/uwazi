import React, { Component } from 'react';
import { Translate } from 'app/I18N';
import DatePicker from './DatePicker';

class DateRange extends Component {
  constructor(props){
    super(props);
    this.state = {
      startDate: undefined,
      endDate: undefined,
    };
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
            onChange={val => this.setState({startDate: val})}
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
            onChange={val => this.setState({endDate: val})}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            minDate={this.state.startDate}
          />
        </div>
      </div>
    );
  }
}  
export default DateRange;
