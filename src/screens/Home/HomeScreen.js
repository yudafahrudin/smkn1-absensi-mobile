import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, ListItem, Header, Text, Badge } from 'react-native-elements';
import _ from 'lodash';
import { getHome } from '../../actions/teacher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EmptyText from '../../components/EmptyText';

class HomeScreen extends React.Component {

    componentDidMount = () => {
        this.startingHomeData()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        await actions.getHome();
    }

    render() {
        const { home } = this.props;
        const { absenToday, schedulesToday } = home;
        if (home) {
            return (
                <>
                    <Header
                        containerStyle={{ backgroundColor: '#3b5998' }}
                        centerComponent={{
                            text: 'HOME',
                            style: { fontSize: 20, fontWeight: 'bold', color: '#fff' }
                        }}
                    />
                    <ScrollView style={
                        {
                            height: '100%',
                            padding: 5,
                            backgroundColor: '#f0f0f0'
                        }}
                    >
                        <View style={{ marginBottom: 50 }}>
                            <Card>
                                <Card.Title style={{ fontSize: 20, fontWeight: '500' }}>
                                    IZIN HARI INI
                                </Card.Title>
                                <Card.Divider />
                                <View>
                                    {
                                        !_.isEmpty(absenToday) ? (absenToday.map((l, i) => (
                                            <ListItem key={i} bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ color: '#000' }}>
                                                        <Text style={{ fontSize: 20 }}>
                                                            {l.user.name}
                                                        </Text>
                                                    </ListItem.Title>
                                                    <ListItem.Subtitle>
                                                        <Text style={{ fontSize: 15 }}>
                                                            {l.reason}
                                                        </Text>
                                                    </ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        ))) : (<EmptyText />)
                                    }
                                </View>
                            </Card>
                            <Card>
                                <Card.Title style={{ fontSize: 20, fontWeight: '400' }}>
                                    JADWAL MENGAJAR
                            </Card.Title>
                                <Card.Divider />
                                {
                                    !_.isEmpty(schedulesToday) ? (schedulesToday.map((l, i) => (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title style={{ color: '#000' }}>
                                                    <Text style={{ fontSize: 20 }}>{l.subject.name}</Text>
                                                    <Text style={{ color: 'grey' }}> {"  "} {l.kelas.grade} {l.kelas.majors} {l.kelas.number}</Text>
                                                </ListItem.Title>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Badge
                                                        containerStyle={{ marginTop: 20 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="primary"
                                                        value={<Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>{l.day}</Text>} />

                                                    <Badge
                                                        containerStyle={{ marginTop: 20 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="warning"
                                                        value={<Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>{l.start_at}</Text>} />

                                                    <Badge
                                                        containerStyle={{ marginTop: 20 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="success"
                                                        value={<Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>{l.end_at}</Text>} />
                                                </View>
                                            </ListItem.Content>
                                        </ListItem>
                                    ))) : (<EmptyText />)
                                }
                            </Card>
                        </View>
                    </ScrollView>
                </>
            )
        } else {
            return (<></>)
        }
    }

}

const mapStateToProps = (state) => ({
    home: _.get(state.teacher, 'home'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getHome,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);


