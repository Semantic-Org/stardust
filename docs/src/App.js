import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Route, Router, withSiteData } from 'react-static'
import { Switch } from 'react-router'
import Routes from 'react-static-routes'
import { unstable_Provider as Provider } from 'semantic-ui-react'

import Sidebar from './components/Sidebar/Sidebar'
import style from './Style'
import { docTypes } from './utils'

const App = ({ componentMenu, versions }) => (
  <div style={style.container}>
    <Provider unstable_cssFramework='fomantic-ui'>
      <Router>
        <>
          <Switch>
            {/*
             * We can't place <Sidebar /> inside of <Routes /> because it will be remounted on page
             * switch. We also don't want to show <Sidebar /> for layouts pages and maximized pages.
             */}
            <Route exact path='/layouts/:name' component={null} />
            <Route path='/maximize/*' component={null} />

            <Route path='/'>
              {(props) => (
                <Sidebar
                  {...props}
                  componentMenu={componentMenu}
                  style={style.menu}
                  version={versions.suir}
                />
              )}
            </Route>
          </Switch>

          <Routes />
        </>
      </Router>
    </Provider>
  </div>
)

App.propTypes = {
  componentMenu: docTypes.componentMenu.isRequired,
  versions: docTypes.versions,
}

export default hot(withSiteData(App))
