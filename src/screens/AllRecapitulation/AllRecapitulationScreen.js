import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, ListItem, Header, Text, Badge, Image } from 'react-native-elements';
import _ from 'lodash';
import { getAllRecapitulationParent } from '../../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmptyText from '../../components/EmptyText';

class AllRecapitulationScreen extends React.Component {

    componentDidMount = () => {
        this.startingHomeData()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        await actions.getAllRecapitulationParent();
    }

    getColorBadge = (status) => {
        if (status == 'absen') {
            return 'error';
        }
        if (status == 'izin') {
            return 'warning';
        }
        if (status == 'sakit') {
            return 'primary';
        }
        return 'warning';
    }

    render() {
        const { allRecap } = this.props;

        return (
            <>
                <ScrollView style={
                    {
                        height: '100%',
                        padding: 5,
                        backgroundColor: '#f0f0f0'
                    }}
                >
                    <View style={{ marginBottom: 50 }}>
                        <Card>
                            <View>
                                {
                                    !_.isEmpty(allRecap) ? (allRecap.map((l, i) => (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title style={{ color: '#000' }}>
                                                    <Text style={{ fontSize: 17 }}>
                                                        {l.date_absent} - semester {l.schedule.semester}
                                                    </Text>
                                                </ListItem.Title>
                                                <ListItem.Subtitle>
                                                    <Badge
                                                        badgeStyle={{ marginVertical: 10, padding: 15 }}
                                                        status="success"
                                                        value={<Text style={{ fontSize: 15, color: 'white' }}>
                                                            {l.schedule.subject.name}
                                                        </Text>}
                                                    />
                                                    <Badge
                                                        badgeStyle={{ marginVertical: 10, marginHorizontal: 10, padding: 15 }}
                                                        status={this.getColorBadge(l.reason)}
                                                        value={<Text style={{ fontSize: 15, color: 'white' }}>
                                                            {l.reason}
                                                        </Text>}
                                                    />
                                                </ListItem.Subtitle>
                                                <Text style={{ width: '100%', fontSize: 17, padding: 10, marginBottom: 10, backgroundColor: '#F4f4f4' }}>
                                                    {l.description}
                                                </Text>

                                                <Image source={{
                                                    uri:
                                                        'https://pinterusmedia.com/storage/user/absent/' + l.user.id + '/' + l.image
                                                }}
                                                    style={{ width: 350, height: 500 }}
                                                />
                                            </ListItem.Content>
                                        </ListItem>
                                    ))) : (<EmptyText />)
                                }
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </>
        )
    }

}

const mapStateToProps = (state) => ({
    allRecap: _.get(state.parent, 'allRecap'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getAllRecapitulationParent,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AllRecapitulationScreen);


