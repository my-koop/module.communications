var React = require("react");

var BSInput = require("react-bootstrap/Input");

var _ = require("lodash");
var __ = require("language").__;

var SettingsContribution = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    settingsRaw: React.PropTypes.object.isRequired,
    addSettingsGetter: React.PropTypes.func.isRequired
  },

  getInitialState: function(props) {
    var props = props || this.props;
    return _.pick(props.settingsRaw, "globalSender");
  },

  componentWillMount: function () {
    this.props.addSettingsGetter(this.getSettings);
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getInitialState(nextProps));
  },

  getSettings: function() {
    return {
      globalSender: this.state.globalSender
    }
  },

  render: function () {
    return (
      <div>
        <BSInput
          type="email"
          valueLink={this.linkState("globalSender")}
          label={__("communications::globalSenderLabel")}
        />
      </div>
    );
  }
});

module.exports = SettingsContribution;
