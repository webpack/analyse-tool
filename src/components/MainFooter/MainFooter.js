import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { links } from '../../shared/links';
import styles from './MainFooter.scss';

const footerLinks = [
  links.aboutUs,
  links.assets,
  links.chunk,
  links.chunks,
  links.error,
  links.errors,
  links.hints,
  links.module,
  links.modules,
  links.select,
  links.upload,
  links.warnings,
];
export default class MainFooter extends React.Component {
  static displayName = 'MainFooter';
  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
      <footer className={ `footer footer-main ${ styles.footer }` }>
        <nav>
          <ul className="inline-list">
            {footerLinks.map((link) =>
              <li key={ link.id } className={ `footer-item ${ styles.item }` }>
                <Link to={ link.to }>
                  <FormattedMessage { ...link } />
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </footer>
    );
  }
}
