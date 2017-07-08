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
      <div className="footer fixed">
        <div className="pull-right">
        </div>
        <div>
            <strong>Copyright</strong> dynastyfftools.com &copy; 2017
        </div>
    </div>
    );
  }
}

Footer.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
};
