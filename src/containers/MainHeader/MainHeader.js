/* eslint operator-linebreak: 0 */
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import debug from 'debug';
import UserDropdownMenu from '../../components/UserDropdownMenu/UserDropdownMenu';
import { loginRequest, logoutRequest } from '../../redux/modules/auth/auth-actions';
import LanguageSelectionDropdown from '../LanguageSelectionDropdown/LanguageSelectionDropdown';
import { links } from '../../shared/links';

if (__DEBUG__) {
  debug.enable('app:*');
}

const log = debug('app:main-header');

class MainHeader extends React.Component {
  static displayName = 'MainHeader';
  static propTypes = {
    dispatch: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
  };

  @autobind
  onLogin() {
    this.props.dispatch(loginRequest());
  }

  @autobind
  onLogout() {
    this.props.dispatch(logoutRequest());
  }

  willReceiveProps(props) {
    log('main-header will receive props', props);
  }

  render() {
    const { user, isAuthenticated } = this.props;

    return (
      <Navbar staticTop fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <FormattedMessage { ...links.home } />
              { /* The above is equivalent to
                <FormattedMessage id={links.home.id}
                                  description={links.home.description}
                                  defaultMessage={links.home.defaultMessage} /> */ }
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LanguageSelectionDropdown />
            <LinkContainer to="/pages/about-us">
              <NavItem role="presentation">
                <FormattedMessage { ...links.aboutUs } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/assets">
              <NavItem role="presentation">
                <FormattedMessage { ...links.assets } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/chunk">
              <NavItem role="presentation">
                <FormattedMessage { ...links.chunk } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/chunks">
              <NavItem role="presentation">
                <FormattedMessage { ...links.chunks } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/error">
              <NavItem role="presentation">
                <FormattedMessage { ...links.error } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/errors">
              <NavItem role="presentation">
                <FormattedMessage { ...links.errors } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/hints">
              <NavItem role="presentation">
                <FormattedMessage { ...links.hints } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/module">
              <NavItem role="presentation">
                <FormattedMessage { ...links.module } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/modules">
              <NavItem role="presentation">
                <FormattedMessage { ...links.modules } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/select">
              <NavItem role="presentation">
                <FormattedMessage { ...links.select } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/upload">
              <NavItem role="presentation">
                <FormattedMessage { ...links.upload } />
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/pages/warnings">
              <NavItem role="presentation">
                <FormattedMessage { ...links.warnings } />
              </NavItem>
            </LinkContainer>
            {isAuthenticated && user ?
              <UserDropdownMenu user={ user } logout={ this.onLogout } />
              :
                <NavItem role="presentation" onClick={ this.onLogin }>
                  <FormattedMessage { ...links.logIn } />
                </NavItem>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user,
  language: state.language,
});

export default connect(mapStateToProps)(MainHeader);
