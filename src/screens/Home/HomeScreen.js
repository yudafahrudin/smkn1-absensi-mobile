import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, ListItem, Header, Text, Badge } from 'react-native-elements';
// import { DataTable } from 'react-native-paper';
import DataTable from 'react-native-paper/lib/commonjs/components/DataTable/DataTable';
import DataTableHeader from 'react-native-paper/lib/commonjs/components/DataTable/DataTableHeader';
import DataTableTitle from 'react-native-paper/lib/commonjs/components/DataTable/DataTableTitle';
import DataTableRow from 'react-native-paper/lib/commonjs/components/DataTable/DataTableRow';
import DataTableCell from 'react-native-paper/lib/commonjs/components/DataTable/DataTableCell';
import _ from 'lodash';
import { getHomeTeacher } from '../../actions/teacher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EmptyText from '../../components/EmptyText';

class HomeScreen extends React.Component {

    componentDidMount = () => {
        this.startingHomeData()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        await actions.getHomeTeacher();
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



    render() {
        const { home } = this.props;
        const { absenToday, schedulesToday } = home;
        let sortschedule = [];
        if (!_.isEmpty(schedulesToday)) {
            Object.keys(schedulesToday).forEach(val => sortschedule.push(schedulesToday[val]))
        }

        const date = new Date();
        const numberdate = date.get
        const tahun = date.getFullYear();
        const bulan = date.getMonth();
        const tanggal = date.getDate();
        const hari = date.getDay();
        const jam = date.getHours();
        const menit = date.getMinutes();
        const detik = date.getSeconds();

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
                            <Card containerStyle={{ padding: 5, paddingTop: 10 }}>
                                <Card.Title style={{ fontSize: 19, fontWeight: 'bold' }}>
                                    SEMUA JADWAL MENGAJAR ANDA
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
                                    <DataTable>
                                        <DataTableHeader>
                                            <DataTableTitle>Hari</DataTableTitle>
                                            <DataTableTitle>Mapel</DataTableTitle>
                                            <DataTableTitle>Kelas</DataTableTitle>
                                            <DataTableTitle>Mulai - Selesai</DataTableTitle>
                                        </DataTableHeader>
                                        {!_.isEmpty(sortschedule) ? (sortschedule.map((l, i) => (
                                            <DataTableRow key={i}>
                                                <DataTableCell>{l.day.slice(0, 3).toUpperCase()}</DataTableCell>
                                                <DataTableCell>{l.subject.name.toUpperCase()}</DataTableCell>
                                                <DataTableCell>{l.kelas.grade} {l.kelas.majors} {l.kelas.number}</DataTableCell>
                                                <DataTableCell>{l.start_at.slice(0, -3)} - {l.end_at.slice(0, -3)}</DataTableCell>

                                            </DataTableRow>
                                        ))) : (<EmptyText />)}
                                    </DataTable>
                                </View>
                                {/* {
                                    !_.isEmpty(sortschedule) ? (sortschedule.map((l, i) => (
                                        <ListItem key={i} bottomDivider>
                                            <ListItem.Content>
                                                <ListItem.Title>
                                                    <Text style={{ color: 'grey', fontSize: 17 }}>{l.day.toUpperCase()} </Text>
                                                    <Text style={{ color: 'grey', fontSize: 17 }}>{"  "}{l.subject.name.toUpperCase()}</Text>
                                                    <Text style={{ color: 'grey', fontSize: 17 }}> {" "} {l.kelas.grade} {l.kelas.majors} {l.kelas.number}</Text>
                                                </ListItem.Title>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Badge
                                                        containerStyle={{ marginTop: 20 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="warning"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                Mulai {l.start_at.slice(0, -3)}
                                                            </Text>
                                                        } />

                                                    <Badge
                                                        containerStyle={{ marginTop: 20 }}
                                                        badgeStyle={{ padding: 15 }}
                                                        status="success"
                                                        value={
                                                            <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>
                                                                Selesai {l.end_at.slice(0, -3)}
                                                            </Text>
                                                        } />
                                                </View>
                                            </ListItem.Content>
                                        </ListItem>
                                    ))) : (<EmptyText />)
                                } */}
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
            getHomeTeacher,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);


