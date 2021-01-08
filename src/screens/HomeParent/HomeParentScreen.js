import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, ListItem, Header, Text, Badge, Button } from 'react-native-elements';
import _ from 'lodash';
import { getHomeParent } from '../../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { DataTable } from 'react-native-paper';
import DataTable from 'react-native-paper/lib/commonjs/components/DataTable/DataTable';
import DataTableHeader from 'react-native-paper/lib/commonjs/components/DataTable/DataTableHeader';
import DataTableTitle from 'react-native-paper/lib/commonjs/components/DataTable/DataTableTitle';
import DataTableRow from 'react-native-paper/lib/commonjs/components/DataTable/DataTableRow';
import DataTableCell from 'react-native-paper/lib/commonjs/components/DataTable/DataTableCell';
import EmptyText from '../../components/EmptyText';
import moment from 'moment';

class HomeParentScreen extends React.Component {

    componentDidMount = () => {
        this.startingHomeData()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        await actions.getHomeParent();
    }

    getColorBadge = (status) => {
        if (status == 'absen') {
            return 'error';
        }
        if (status == 'hadir') {
            return 'success';
        }
        if (status == 'sedang berjalan') {
            return 'primary';
        }
        if (status == 'belum di mulai') {
            return 'primary';
        }
        return 'warning';
    }

    getDayName = (name) => {
        switch (name) {
            case 'Sun':
                return "Minggu";
            case 'Mon':
                return "Senin";
            case 'Tue':
                return "Selasa";
            case 'Wed':
                return "Rabu";
            case 'Thu':
                return "Kamis";
            case 'Fri':
                return "Jumat";
            case 'Sat':
                return "Sabtu";
            default:
                return "Liburan";
        }
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

    returnBadge = (data) => {
        return (<Badge
            badgeStyle={{ padding: 13 }}
            status={this.getColorBadge(data.absenteeism)}
            value={<Text style={{ fontSize: 13, color: 'white' }}>
                {data.absenteeism}
            </Text>}
        />);
    }

    render() {
        const { home, user } = this.props;
        const { absenToday } = home;
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
                            <Card>
                                <Card.Title style={{ fontSize: 20, fontWeight: '500' }}>
                                    JADWAL ANAK ANDA HARI INI
                                </Card.Title>
                                <Card.Divider />
                                <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginBottom: 20 }}>
                                    <Text style={{ marginRight: 10, fontSize: 16, color: 'grey' }}>
                                        {this.changeDayName(hari)},
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
                                <View>
                                    {/* <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                        Hari {this.getDayName(moment().format('ddd'))}
                                    </Text> */}
                                    {/* <View>
                                        <DataTable>
                                            <DataTableHeader>
                                                <DataTableTitle>Hari</DataTableTitle>
                                                <DataTableTitle>Mapel</DataTableTitle>

                                                <DataTableTitle>Mulai - Selesai</DataTableTitle>
                                            </DataTableHeader>
                                            {!_.isEmpty(absenToday) ? (absenToday.map((l, i) => (
                                                <DataTableRow>
                                                    <DataTableCell>{l.day.slice(0, 3).toUpperCase()}</DataTableCell>
                                                    <DataTableCell>{l.subject.name.toUpperCase()}</DataTableCell>
                                                    <DataTableCell>{l.start_at.slice(0, -3)} - {l.end_at.slice(0, -3)}</DataTableCell>

                                                </DataTableRow>
                                            ))) : (<EmptyText />)}
                                        </DataTable>
                                    </View> */}
                                    {
                                        !_.isEmpty(absenToday) ? (absenToday.map((l, i) => (
                                            <ListItem key={i} bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ color: '#000' }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                                            {l.subject.name}
                                                        </Text>
                                                        {/* <Text style={{ fontSize: 15 }}>
                                                            {"   "} {l.start_at} - {l.end_at}
                                                        </Text> */}
                                                    </ListItem.Title>
                                                    {/* <ListItem.Subtitle> */}
                                                    {/* <Badge
                                                            badgeStyle={{ marginVertical: 10, padding: 15 }} status={this.getColorBadge(l.absenteeism)}
                                                            value={<Text style={{ fontSize: 15, color: 'white' }}>
                                                                {l.absenteeism}
                                                            </Text>}
                                                        /> */}
                                                    <DataTable>
                                                        <DataTableHeader>
                                                            <DataTableTitle numberOfLines={20}>Status</DataTableTitle>
                                                            <DataTableTitle>Mulai - Selesai</DataTableTitle>
                                                        </DataTableHeader>
                                                        <DataTableRow>
                                                            <DataTableCell>
                                                                {/* {l.absenteeism} */}
                                                                {this.returnBadge(l)}
                                                            </DataTableCell>
                                                            <DataTableCell>{l.start_at.slice(0, -3)} - {l.end_at.slice(0, -3)}</DataTableCell>
                                                        </DataTableRow>
                                                    </DataTable>
                                                    {/* </ListItem.Subtitle> */}
                                                </ListItem.Content>
                                            </ListItem>
                                        ))) : (<EmptyText />)
                                    }
                                </View>
                                <Button
                                    containerStyle={{ marginTop: 50 }}
                                    onPress={() => this.props.navigation.navigate('AllRecapitulation')}
                                    title="Lihat Semua Rekapitulasi" />
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
    home: _.get(state.parent, 'home'),
    user: _.get(state.session, 'user'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getHomeParent,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeParentScreen);


