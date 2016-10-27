import React, { PropTypes } from 'react';
import site from './../../settings';
import { Hero, HeroContent, HeroBackground } from '../../components/Hero/index';
import { VAContainer, VAMiddle } from '../../components/VAlign/VAlign';
import styles from './HomePage.scss';

const HomePageHero = (props) =>
  (
    <Hero displayUnderNavbar>
      <HeroBackground image={ props.backgroundImage } />
      <HeroContent>
        <VAContainer horizontal vertical>
          <VAMiddle>
            <div className="text-center">
              <h1 className={ styles['hero-title'] }>
                {site.name}
              </h1>

              <p className={ styles['hero-description'] }>
                {site.description}
              </p>
            </div>
          </VAMiddle>
        </VAContainer>
      </HeroContent>
    </Hero>
  );

HomePageHero.displayName = 'HomePageHero';

HomePageHero.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
};

export default HomePageHero;
