import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import { requireAuthentication as restrict } from './containers/AuthenticatedComponent';

import AppContainer from './containers/AppContainer';
import HeroPageLayout from './containers/HeroPageLayout';
import AdminPageLayout from './containers/AdminPageLayout';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import AssetsPage from './pages/AssetsPage/AssetsPage';
import ChunkPage from './pages/ChunkPage/ChunkPage';
import ChunksPage from './pages/ChunksPage/ChunksPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import ErrorsPage from './pages/ErrorsPage/ErrorsPage';
import HintsPage from './pages/HintsPage/HintsPage';
import ModulePage from './pages/ModulePage/ModulePage';
import ModulesPage from './pages/ModulesPage/ModulesPage';
import SelectPage from './pages/SelectPage/SelectPage';
import UploadPage from './pages/UploadPage/UploadPage';
import WarningsPage from './pages/WarningsPage/WarningsPage';
import ProfileEditPage from './pages/ProfileEditPage/ProfileEditPage';

export default(
  // Route components without path will render their children...
  <Route component={ AppContainer }>
    // until a match is found...
    <Route component={ HeroPageLayout }>
      // here
      <Route path="/" component={ HomePage } />
      // Routes without a component will render their children:
      <Route path="/pages" >
        <IndexRedirect to="about-us" />
        <Route path="about-us" component={ AboutPage } />
        <Route path="assets" component={ AssetsPage } />
        <Route path="chunk" component={ ChunkPage } />
        <Route path="chunks" component={ ChunksPage } />
        <Route path="error" component={ ErrorPage } />
        <Route path="errors" component={ ErrorsPage } />
        <Route path="hints" component={ HintsPage } />
        <Route path="module" component={ ModulePage } />
        <Route path="modules" component={ ModulesPage } />
        <Route path="select" component={ SelectPage } />
        <Route path="upload" component={ UploadPage } />
        <Route path="warnings" component={ WarningsPage } />
      </Route>
    </Route>

    <Route path="/account" component={ AdminPageLayout }>
      <Route path="/profile/edit" component={ restrict(ProfileEditPage) } />
    </Route>
  </Route>
);
