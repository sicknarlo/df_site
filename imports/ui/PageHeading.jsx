import React from 'react';
import { Link } from 'react-router';

export default class PageHeading extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     open: false,
  //   };
  //   this.toggle = this.toggle.bind(this);
  // }
  render() {
    const additional = this.props.additional ? <h3>{this.props.additional}</h3> : null;
    return (
      <div className="row wrapper border-bottom white-bg page-heading">
        <div className="col-lg-12">
            <h2>{this.props.current}</h2>
            {additional}
            <h3>Current database: {this.props.db}</h3>
        </div>
    </div>
    );
  }
}

PageHeading.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
  current: React.PropTypes.string,
};
