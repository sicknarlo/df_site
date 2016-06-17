import React from 'react';

export default class Footer extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     open: false,
  //   };
  //   this.toggle = this.toggle.bind(this);
  // }

  render() {
    return (
      <div className="footer">
        <div className="pull-right">
          10GB of <strong>250GB</strong> Free.
        </div>
        <div>
            <strong>Copyright</strong> Dynasty Fantasy HQ &copy; 2016
        </div>
    </div>
    );
  }
}

Footer.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
};
