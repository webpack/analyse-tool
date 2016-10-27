import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import debug from 'debug';
import { autobind } from 'core-decorators';
import styles from './HomePage.scss';
import { messages } from './HomePage.i18n';
import HomePageHero from './HomePageHero';
import {
  updateDocumentTitle,
  resetDocumentTitle,
} from '../../redux/modules/document-title/document-title';

if (__DEBUG__) {
  debug.enable('home-page:*');
}

const log = debug('home-page:info');

export class HomePage extends React.Component {
  static displayName = 'HomePage';
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  // executes only on the client
  componentDidMount() {
    this.props.dispatch(updateDocumentTitle(messages.title));
  }

  componentWillUnmount() {
    log('remove custom document title');
    this.props.dispatch(resetDocumentTitle());
  }

  @autobind
  handleButtonClick() {
    log('button click handler context:', this);
  }

  render() {
    return (
      <div id="home-page">
        <HomePageHero backgroundImage="/images/webpack-r3analyse.png" />
        <Grid>
          <Row>
            <Col xs={ 12 }>
              <h1 className={ styles.title }>
                <FormattedMessage { ...messages.title } />
              </h1>
              <p>
                <FormattedHTMLMessage { ...messages.para.pressCtrlH } />
              </p>
              <p>
                <FormattedHTMLMessage { ...messages.para.autoUpdate } />
              </p>
              <p>
                <FormattedHTMLMessage { ...messages.para.es7Decorator } />
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={ 6 } md={ 2 }>
              <Button bsStyle="primary" onClick={ this.handleButtonClick }>
                <FormattedMessage { ...messages.button.clickMe } />
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) =>
  ({ isAuthenticated: state.isAuthenticated });

export default connect(mapStateToProps)(HomePage);
