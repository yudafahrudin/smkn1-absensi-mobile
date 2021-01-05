import React, { useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Badge, ButtonGroup, Card, ListItem, Header, Button, Overlay, CheckBox, Divider } from 'react-native-elements';
import DataTable from 'react-native-paper/lib/commonjs/components/DataTable/DataTable';
import DataTableHeader from 'react-native-paper/lib/commonjs/components/DataTable/DataTableHeader';
import DataTableTitle from 'react-native-paper/lib/commonjs/components/DataTable/DataTableTitle';
import DataTableRow from 'react-native-paper/lib/commonjs/components/DataTable/DataTableRow';
import DataTableCell from 'react-native-paper/lib/commonjs/components/DataTable/DataTableCell';
import { getAbsentTeacher, submitAbsentTeacher } from '../../actions/teacher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import EmptyText from '../../components/EmptyText';

class AbsentScreen extends React.Component {

    state = {
        selectedIndex: -1,
        absention: [],
        absentionFiltering: [],
        statusName: ['masuk', 'absen', 'sakit', 'izin', 'lainnya'],
        isOverlay: false,
        isFocus: false,
    }

    componentDidMount = () => {
        this.startingAbsentData()
    }

    componentWillUnmount = () => {
        this.setState({
            isFocus: true
        })
    }

    startingAbsentData = async () => {
        const { actions } = this.props;
        await actions.getAbsentTeacher().then(() =>
            setTimeout(() => this.generateListAbsention(), 100)
        );
    }

    generateListAbsention = (obj = null) => {
        const { absent } = this.props;
        const { classToday } = absent;
        let student = [];
        if (classToday) {
            classToday.map((val) => {
                if (val.status) {
                    _.assign(val, { status: val.detail ? this.indexOfStatusName(val.detail.reason) : val.status });
                    student[val.id] = val;
                }
            });
        }

        this.setState({
            isFocus: false,
            absention: student
        })
    }

    updateIndex = (status, studentId) => {
        const { absention } = this.state
        const studentData = absention[studentId];
        console.log(status, studentId, studentData);
        if (studentData) {
            if (status == studentData.status) {
                studentData.status = 1000;
            } else {
                studentData.status = status;
            }
        }

        this.setState({
            absention,
        })
    }

    indexOfStatusName = (value) => {
        const { statusName } = this.state
        if (typeof value == 'number') return value;
        if (value == 'masuk') return 1000;
        if (value != 'masuk') return statusName.indexOf(value);
    }

    getSelectedIndex = (studentId) => {
        const { absention } = this.state
        const studentData = absention[studentId];
        const studentStatus = studentData ? studentData.status : 0;
        return studentStatus;
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

    filteringStatus = (obj) => {
        if (!_.isEmpty(obj)) {
            obj.filter(val => {
                val.status = this.indexOfStatusName(val.status);
            })
            return obj;
        }
        return [];
    }

    submitAbsention = async () => {
        const { absention, statusName } = this.state;
        const { actions, absent } = this.props;
        const { scheduleToday } = absent;
        const userId = absention.map(val => val.id).filter(val => val);
        const reasons = absention.map(val => statusName[val.status]).filter(val => val);
        await actions.submitAbsentTeacher(scheduleToday.id, userId, reasons).then(() => this.setOverlay());
    }

    changeDayName = (hari) => {
        switch (hari) {
            case 0: hari = "Minggu"; break;
            case 1: hari = "Senin"; break;
            case 2: hari = "Selasa"; break;
            case 3: hari = "Rabu"; break;
            case 4: hari = "Kamis"; break;
            case 5: hari = "Jum'at"; break;
            case 6: hari = "Sabtu"; break;
        }
        return hari;
    }

    changeMonthName = (bulan) => {
        switch (bulan) {
            case 0: bulan = "Januari"; break;
            case 1: bulan = "Februari"; break;
            case 2: bulan = "Maret"; break;
            case 3: bulan = "April"; break;
            case 4: bulan = "Mei"; break;
            case 5: bulan = "Juni"; break;
            case 6: bulan = "Juli"; break;
            case 7: bulan = "Agustus"; break;
            case 8: bulan = "September"; break;
            case 9: bulan = "Oktober"; break;
            case 10: bulan = "November"; break;
            case 11: bulan = "Desember"; break;
        }
        return bulan;
    }

    submitFrom = (from) => {
        if (from.submit_from_admin) {
            return 'absensi diupdate oleh Admin'
        }
        if (from.submit_from_teacher) {
            return 'absensi diupdate oleh Guru'
        }
        if (from.submit_from_parent) {
            return 'absensi diupdate oleh Orang Tua'
        }
    }

    render() {
        const { absent } = this.props;
        const { classToday, scheduleToday } = absent;
        const { absention, statusName, isOverlay, absentionFiltering, isFocus } = this.state;

        const date = new Date();
        const numberdate = date.get
        const tahun = date.getFullYear();
        const bulan = date.getMonth();
        const tanggal = date.getDate();
        const hari = date.getDay();
        const jam = date.getHours();
        const menit = date.getMinutes();
        const detik = date.getSeconds();

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
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
                                <Button onPress={() => this.submitAbsention()} title="Ya, kirim" />
                                <Button onPress={() => this.setOverlay()} containerStyle={{ marginLeft: 20 }} title="Batal" />
                            </View>
                        </View>
                    </Overlay>
                    <ScrollView style={
                        {
                            height: '100%',
                            padding: 0,
                            backgroundColor: '#f0f0f0'
                        }}
                    >
                        <View style={{ marginBottom: 50, marginHorizontal: -15 }}>
                            <Card>
                                <Card.Title style={{ fontSize: 19, fontWeight: 'bold' }}>
                                    JADWAL YANG SEDANG BERJALAN
                            </Card.Title>
                                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    {/* <Text style={{ marginRight: 10, fontSize: 16, color: 'grey', fontWeight: 'bold' }}>
                                        Hari
                                    </Text> */}
                                    <Text style={{ marginRight: 10, fontSize: 16, color: 'grey' }}>
                                        {this.changeDayName(hari)}
                                    </Text>
                                    <Text style={{ marginRight: 10, fontSize: 16, color: 'grey' }}>
                                        {tanggal}
                                        {" "}
                                    /
                                    {" "}
                                        {this.changeMonthName(bulan)}
                                        {" "}
                                    /
                                    {" "}
                                        {tahun}
                                    </Text>
                                </View>
                                <Card.Divider />
                                <View>
                                    {
                                        !_.isEmpty(scheduleToday) ? (<DataTable>
                                            <DataTableHeader>
                                                <DataTableTitle numberOfLines={200}>Mata Pelajaran</DataTableTitle>
                                                {/* <DataTableTitle></DataTableTitle> */}
                                                <DataTableTitle>Jam Mulai - Selesai</DataTableTitle>
                                            </DataTableHeader>

                                            <DataTableRow>
                                                <DataTableCell>{scheduleToday.subject.name}</DataTableCell>
                                                {/* <DataTableCell> {scheduleToday.start_at.slice(0, -3)} </DataTableCell> */}
                                                <DataTableCell> {scheduleToday.start_at.slice(0, -3)}  -  {scheduleToday.end_at.slice(0, -3)}</DataTableCell>

                                            </DataTableRow>

                                        </DataTable>) : (<EmptyText />)
                                    }

                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    {/* {
                                        !_.isEmpty(scheduleToday) ? (
                                            <>
                                                <Text style={{ fontSize: 20 }}>
                                                    {scheduleToday.kelas.grade + " "}
                                                    {scheduleToday.kelas.majors + " "}
                                                    {scheduleToday.kelas.number + " "}
                                                    -
                                                    {" "}{scheduleToday.subject.name}{" "}
                                                </Text>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    height: 50,
                                                    justifyContent: 'space-around',
                                                    alignItems: 'center'
                                                }}>
                                                    <Badge

                                                        badgeStyle={{ padding: 15 }}
                                                        status="warning"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                Mulai : {scheduleToday.start_at}
                                                            </Text>
                                                        }
                                                    />
                                                    <Badge
                                                        badgeStyle={{ padding: 15 }}
                                                        status="success"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                Selesai : {scheduleToday.end_at}
                                                            </Text>
                                                        }
                                                    />
                                                </View>
                                            </>
                                        ) : (<EmptyText />)
                                    } */}
                                </View>
                            </Card>
                            <Card containerStyle={{ padding: 2, paddingBottom: 20 }}>
                                {
                                    !_.isEmpty(absention) ? (
                                        <>
                                            <Card.Title style={{ fontSize: 19, fontWeight: 'bold', marginTop: 10 }}>
                                                KELAS
                                                {" "}
                                                {scheduleToday.kelas.grade + " "}
                                                {scheduleToday.kelas.majors + " "}
                                                {scheduleToday.kelas.number + " "}
                                            </Card.Title>
                                            <Card.Divider />
                                        </>
                                    ) : null
                                }

                                <View style={{ justifyContent: 'center' }}>
                                    {/* <View style={{ marginTop: 10, marginBottom: 20, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignContent: 'space-around' }}>
                                            <Text style={{ margin: 5 }}>M = Masuk </Text>
                                            <Text style={{ margin: 5 }}>A = Absent </Text>
                                            <Text style={{ margin: 5 }}>S = Sakit </Text>
                                            <Text style={{ margin: 5 }}>I = Izin </Text>
                                        </View>
                                    </View> */}
                                    {
                                        !_.isEmpty(absention) ? absention.map((l, i) => (
                                            <ListItem key={i} containerStyle={{ padding: 5, margin: 3 }} style={{ marginTop: -10 }}>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ fontSize: 17, fontWeight: 'bold', margin: 10 }}>{l.name.toUpperCase()}</ListItem.Title>
                                                    <View style={{
                                                        flexDirection: 'row', alignItems: 'space-between',
                                                        width: '90%'
                                                    }}>
                                                        <CheckBox
                                                            title='M'
                                                            checked={this.indexOfStatusName(l.status) == 0 ? true : false}
                                                            onPress={() => this.updateIndex(0, l.id)}
                                                        />
                                                        <CheckBox
                                                            title='A'
                                                            checked={this.indexOfStatusName(l.status) === 1 ? true : false}
                                                            onPress={() => this.updateIndex(1, l.id)}
                                                        />
                                                        <CheckBox
                                                            title='S'
                                                            checked={this.indexOfStatusName(l.status) == 2 ? true : false}
                                                            onPress={() => this.updateIndex(2, l.id)}
                                                        />
                                                        <CheckBox
                                                            title='I'
                                                            checked={this.indexOfStatusName(l.status) == 3 ? true : false}
                                                            onPress={() => this.updateIndex(3, l.id)}
                                                        />
                                                    </View>
                                                    {l.detail ? (
                                                        <View flexDirection="row">
                                                            <Text style={{ fontSize: 15, color: 'grey', marginLeft: 10, marginTop: 10 }}>
                                                                {l.detail ? this.submitFrom(l.detail) : null}
                                                            </Text>
                                                            <Text
                                                                style={{ fontSize: 15, marginLeft: 10, marginTop: 10, color: 'blue', textDecorationLine: 'underline' }}
                                                                onPress={() => this.props.navigation.navigate('AbsentDetailScreen', l.detail)}
                                                            >
                                                                klik untuk lihat detail
                                                            </Text>
                                                        </View>
                                                    ) : null}

                                                </ListItem.Content>
                                            </ListItem>
                                        )) : (<View style={{ marginTop: 10 }}><EmptyText /></View>)
                                    }
                                </View>

                                {
                                    !_.isEmpty(absention) ?
                                        <View style={{ width: '100%', alignItems: 'center' }}>
                                            <Button containerStyle={{ width: '90%', marginVertical: 20 }} onPress={() => { this.setOverlay() }} title="Kirim Absensi" />
                                        </View> : <></>
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
    home: _.get(state.teacher, 'home'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getAbsentTeacher,
            submitAbsentTeacher
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AbsentScreen);


