import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import queryString from 'query-string'
import {
    Container,
    Form,
    Header,
    Segment,
    Accordion,
    Icon,
    Table,
    Label,
    AccordionTitleProps,
    Dropdown,
    DropdownProps,
    InputOnChangeData } from 'semantic-ui-react'

import HD from './../resources/hd.yaml'
import BD from './../resources/bd.yaml'
import LG from './../resources/lg.yaml'
import AM from './../resources/am.yaml'
import BS from './../resources/bs.yaml'
import AC from './../resources/ac.yaml'
import MAIN from './../resources/main.yaml'
import SUB from './../resources/sub.yaml'
import ETC from './../resources/etc.yaml'
import Recepi from './../types/recipe'

type filter = 'all' | 'hd' | 'bd' | 'lg' | 'am' | 'bs' | 'ac' | 'main' | 'sub' | 'etc'

export interface Props extends RouteComponentProps<{}> {
}

export interface State {
    open: number
    filter: filter
    keyword: string
}

export default class IndexPage extends React.Component<Props, State> {
    filter: {key: string, text: string, value: string}[]
    recipes: Recepi[]

    constructor(props: Props) {
        super(props)

        this.filter = ['All', 'HD', 'BD', 'LG', 'AM', 'BS', 'AC', 'Main', 'Sub', 'etc'].map((item) => {
            return {key: item, text: item, value: item.toLowerCase()}
        })
        this.recipes = [
            ...HD,
            ...BD,
            ...LG,
            ...AM,
            ...BS,
            ...AC,
            ...MAIN,
            ...SUB,
            ...ETC,
        ]
        const query = queryString.parse(this.props.location.search) as {filter: filter, keyword: string}

        this.state = {
            open: -1,
            filter: this.filter.some((item) => item.value === query.filter)? query.filter : 'all',
            keyword: query.keyword || '',
        }
        document.title = `C21 Laboratory Recipes | ${this.state.keyword}`
    }

    componentWillReceiveProps(nextProps: Props) {
        const query = queryString.parse(nextProps.location.search) as {filter: filter, keyword: string}
        this.setState({
            filter: this.filter.some((item) => item.value === query.filter)? query.filter : 'all',
            keyword: query.keyword || '',
        })
    }

    handleClick(event: React.MouseEvent, accordion: AccordionTitleProps) {
        const index = parseInt(accordion.index!.toString())
        this.setState({
            open: index == this.state.open? -1 : index
        })
    }

    changeFilter(data: DropdownProps) {
        this.setState({
            open: -1,
            filter: data.value as filter
        }, () => {
            this.props.history.push(`?filter=${this.state.filter}&keyword=${this.state.keyword}`)
        })
    }

    changeKeyword(data: InputOnChangeData) {
        this.setState({
            open: -1,
            keyword: data.value
        })
    }

    getRecipes() {
        const {keyword, filter} = this.state
        const target = filter == 'all'? this.recipes : {
            hd: HD,
            bd: BD,
            lg: LG,
            am: AM,
            bs: BS,
            ac: AC,
            main: MAIN,
            sub: SUB,
            etc: ETC,
        }[filter]

        const d = target.filter((recipe) => {
            return [
                // No
                recipe.no.toString().includes(keyword),
                // Recipe Name
                recipe.name.includes(keyword),
                // Item name
                recipe.recipe.some((i) => i.item.includes(keyword))
            ].includes(true)
        })
        return d
    }

    render(): JSX.Element {
        const recipes = this.getRecipes()

        return (
            <Container>
                <Segment>
                    <Header content='C21 laboratory recipe' />
                    <Form>
                        <Form.Input
                            placeholder='レシピ名/No/素材名'
                            value={this.state.keyword}
                            onChange={(e, d) => this.changeKeyword(d)}
                            onBlur={() => {
                                const query = `?filter=${this.state.filter}&keyword=${this.state.keyword}`
                                if (query !== this.props.location.search) {
                                    this.props.history.push(`?filter=${this.state.filter}&keyword=${this.state.keyword}`)
                                    document.title = `C21 Laboratory Recipes | ${this.state.keyword}`
                                }
                            }}
                            icon='search'
                            iconPosition='left'
                            action={
                                <Dropdown button basic floating options={this.filter} value={this.state.filter} onChange={(e, d) => this.changeFilter(d)} />
                            } />
                    </Form>
                </Segment>

                <Segment>
                    <Header content='Result' />
                    <Accordion fluid styled>
                    {recipes.map((item, index) => {
                        return (
                            <div key={item.no}>
                                <Accordion.Title active={index == this.state.open} index={index} onClick={(e, p) => this.handleClick(e, p)}>
                                    <Icon name='dropdown' />{item.name}
                                </Accordion.Title>
                                <Accordion.Content active={index == this.state.open}>
                                    <Table celled striped unstackable>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>アイテム名</Table.HeaderCell>
                                                <Table.HeaderCell>必要数</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {item.recipe.map((i) => {
                                                return (
                                                    <Table.Row key={i.item}>
                                                        <Table.Cell width='13'>
                                                            {i.safety? <Label ribbon color='yellow' content='Safety' /> : null}
                                                            {i.item}
                                                        </Table.Cell>
                                                        <Table.Cell>{i.required}</Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}

                                        </Table.Body>
                                    </Table>
                                </Accordion.Content>
                            </div>
                        )
                    })}
                    </Accordion>
                </Segment>
            </Container>

        )
    }
}
