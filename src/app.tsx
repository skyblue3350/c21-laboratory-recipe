import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import IndexPage from './routes/indexPage'


type filter = 'all' | 'hd' | 'bd' | 'lg' | 'am' | 'bs' | 'ac' | 'main' | 'sub' | 'etc'

export interface Props {
}

export interface State {
}

export default class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    render(): JSX.Element {
        return (
            <Router basename='/'>
                <Container>
                    <Route render={(routeProps) => <IndexPage {...routeProps} />} />
                </Container>
            </Router>

        )
    }
}