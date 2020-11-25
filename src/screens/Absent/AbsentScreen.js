import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Badge, ButtonGroup, Card, ListItem, Header, Button, Overlay } from 'react-native-elements';
import { getAbsent, submitAbsent } from '../../actions/teacher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import EmptyText from '../../components/EmptyText';

class AbsentScreen extends React.Component {

    state = {
        selectedIndex: -1,
        absention: [],
        absentionFiltering: [],
        statusName: ['masuk', 'absen', 'izin', 'sakit', 'lainnya'],
        isOverlay: false
    }

    componentDidMount = () => {
        this.startingAbsentData()
    }

    startingAbsentData = async () => {
        const { actions } = this.props;
        await actions.getAbsent().then(() =>
            this.generateListAbsention()
        );
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

    updateIndex = (status, studentId) => {
        const { absention } = this.state
        const studentData = absention[studentId];
        console.log(status, studentId, studentData);
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

    setOverlay = () => {
        const { isOverlay } = this.state;
        this.setState({
            isOverlay: !isOverlay
        })
    }

    filterAbsentionStudent = () => {
        const { absention } = this.state;
        this.setOverlay()

        const filtering = absention.filter((val) => val.status !== 0);
        this.setState({
            absentionFiltering: filtering
        })
    }

    submitAbsention = async () => {
        const { absentionFiltering, statusName } = this.state;
        const { actions, absent } = this.props;
        const { scheduleToday } = absent;
        const userId = absentionFiltering.map(val => val.id);
        const reasons = absentionFiltering.map(val => statusName[val.status]);
        await actions.submitAbsent(scheduleToday.id, userId, reasons).then(() => this.setOverlay());
    }



    render() {
        const { absent } = this.props;
        const { classToday, scheduleToday } = absent;
        const { absention, statusName, isOverlay, absentionFiltering } = this.state;

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
                    <Overlay isVisible={isOverlay}>
                        <View style={{ width: 340 }}>
                            <Text style={{ fontSize: 18, textAlign: 'center' }}>Apakah anda yakin dengan absensi ini ?</Text>
                            <View style={{ marginTop: 20 }}>

                                {
                                    !_.isEmpty(absentionFiltering) ? absentionFiltering.map((val) =>
                                        <>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                                {val.name}
                                                {" "}
                                                ({statusName[val.status]})
                                            </Text>
                                        </>
                                    ) : <EmptyText />
                                }

                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
                                <Button disabled={_.isEmpty(absentionFiltering)} onPress={() => this.submitAbsention()} title="Ya, kirim" />
                                <Button onPress={() => this.setOverlay()} containerStyle={{ marginLeft: 20 }} title="Batal" />
                            </View>
                        </View>
                    </Overlay>
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
                                <Text>Menambahkan respon list absent untuk membuat auto button grup sesuai dengan status absen siswa</Text>
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

                                {
                                    !_.isEmpty(classToday) ?
                                        <>
                                            <Card.Divider />
                                            <Button onPress={() => { this.filterAbsentionStudent() }} title="Kirim Absensi" />
                                        </> : <></>
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
            submitAbsent
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AbsentScreen);


