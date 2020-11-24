import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Badge, ButtonGroup, Card, ListItem, Header } from 'react-native-elements';
import { getAbsent } from '../../actions/teacher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import EmptyText from '../../components/EmptyText';

class AbsentScreen extends React.Component {

    state = {
        selectedIndex: -1,
        absention: [],
        statusName: ['masuk', 'absen', 'izin', 'sakit', 'lainnya']
    }

    componentDidMount = () => {
        this.startingAbsentData()
        this.generateListAbsention()
    }

    startingAbsentData = async () => {
        const { actions } = this.props;
        await actions.getAbsent();
    }

    updateIndex = (status, studentId) => {
        const { absention } = this.state
        const studentData = absention[studentId];

        if (studentData) {
            studentData.status = status;
        }

        this.setState({
            absention
        })
    }

    getSelectedIndex = (studentId) => {
        const { absention } = this.state
        const studentData = absention[studentId];
        return studentData ? studentData.status : 0;
    }

    generateListAbsention = () => {
        const { absent } = this.props;
        const { classToday } = absent;

        let student = [];
        if (classToday) {
            classToday.map((val) => {
                _.assign(val, { status: 0 });
                student[val.id] = val;
            });
        }

        this.setState({
            absention: student
        })
    }

    render() {
        const { absent } = this.props;
        const { classToday, scheduleToday } = absent;
        const { absention, statusName } = this.state;

        console.log('absent', absention);

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
                                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                                    ({" "}{scheduleToday.subject.name}{" "})
                                                </Text>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    height: 50,
                                                    justifyContent: 'space-around',
                                                    alignItems: 'center'
                                                }}>
                                                    <Badge
                                                        // containerStyle={{ marginTop: 20 }}
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
                                                        // containerStyle={{ marginTop: 20 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="warning"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                {scheduleToday.start_at}
                                                            </Text>
                                                        }
                                                    />
                                                    <Badge
                                                        // containerStyle={{ marginTop: 20 }}
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
                                {
                                    !_.isEmpty(scheduleToday) ? (<Card.FeaturedSubtitle style={{ textAlign: 'center', marginTop: -5 }}>
                                        <Text style={{ color: "#000", fontSize: 20, fontWeight: 'bold' }}>
                                            ({" "}
                                            {scheduleToday.kelas.grade + " "}
                                            {scheduleToday.kelas.majors + " "}
                                            {scheduleToday.kelas.number + " "}
                                            {" "})
                                     </Text>
                                    </Card.FeaturedSubtitle>) : (<></>)
                                }
                                <Card.Divider />
                                <View>
                                    {
                                        !_.isEmpty(classToday) ? classToday.map((l, i) => (
                                            <ListItem key={i} style={{ marginTop: -10 }}>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ fontSize: 17 }}>{l.name}</ListItem.Title>
                                                    <ListItem.Subtitle>{l.nis}</ListItem.Subtitle>
                                                    <ButtonGroup
                                                        onPress={(index) => this.updateIndex(index, l.id)}
                                                        selectedIndex={this.getSelectedIndex(l.id)}
                                                        buttons={statusName}
                                                        selectedTextStyle={styles.selectedText}
                                                        containerStyle={{
                                                            marginLeft: 0,
                                                            marginTop: 10
                                                        }}
                                                    />
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

const styles = StyleSheet.create({
    selectedText: {
        color: "#fff"
    }
});

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


