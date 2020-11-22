import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Badge, Card, ListItem, Header } from 'react-native-elements';
import _ from 'lodash';
import { getAbsent } from '../../actions/teacher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EmptyText from '../../components/EmptyText';

class AbsentScreen extends React.Component {
    componentDidMount = () => {
        this.startingAbsentData()
    }

    startingAbsentData = async () => {
        const { actions } = this.props;
        await actions.getAbsent();
    }

    render() {
        const { absent } = this.props;
        const { classToday, scheduleToday } = absent;

        if (absent) {
            return (
                <>
                    <Header
                        containerStyle={{ backgroundColor: '#3b5998' }}
                        centerComponent={{
                            text: 'MENU ABSENSI',
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
                                    JADWAL ANDA SEKARANG
                        </Card.Title>
                                <Card.Divider />
                                <View style={{ alignItems: 'center' }}>
                                    {
                                        !_.isEmpty(scheduleToday) ? (
                                            <>
                                                <Text style={{ fontSize: 20 }}>
                                                    {scheduleToday.subject.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Badge
                                                        containerStyle={{ marginTop: 20 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="primary"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                {scheduleToday.kelas.grade + " "}
                                                                {scheduleToday.kelas.majors + " "}
                                                                {scheduleToday.kelas.number + " "}
                                                            </Text>
                                                        }
                                                    />
                                                    <Badge
                                                        containerStyle={{ marginTop: 20, marginLeft: 10 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="warning"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                {scheduleToday.start_at}
                                                            </Text>
                                                        }
                                                    />
                                                    <Badge
                                                        containerStyle={{ marginTop: 20, marginLeft: 10 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="success"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                {scheduleToday.end_at}
                                                            </Text>
                                                        }
                                                    />
                                                </View>
                                            </>
                                        ) : (<EmptyText />)
                                    }
                                </View>
                            </Card>
                            <Card>
                                <Card.Title style={{ fontSize: 20, fontWeight: '400' }}>
                                    DAFTAR SISWA DI JADWAL SEKARANG
                        </Card.Title>
                                <Card.Divider />
                                <View>
                                    {
                                        !_.isEmpty(classToday) ? classToday.map((l, i) => (
                                            <ListItem key={i} bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ color: '#000' }}>{l.name}</ListItem.Title>
                                                    <ListItem.Subtitle>{l.nis}</ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        )) : (<EmptyText />)
                                    }
                                </View>
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
    absent: _.get(state.teacher, 'absent'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getAbsent,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AbsentScreen);


