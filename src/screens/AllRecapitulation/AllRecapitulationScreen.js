import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { Card, ListItem, Overlay, Text, Badge, Image, ButtonGroup } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer'
import _ from 'lodash';
import { Picker } from '@react-native-picker/picker';
import { getAllRecapitulationParent } from '../../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmptyText from '../../components/EmptyText';
import { Button } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import DataTable from 'react-native-paper/lib/commonjs/components/DataTable/DataTable';
import DataTableHeader from 'react-native-paper/lib/commonjs/components/DataTable/DataTableHeader';
import DataTableTitle from 'react-native-paper/lib/commonjs/components/DataTable/DataTableTitle';
import DataTableRow from 'react-native-paper/lib/commonjs/components/DataTable/DataTableRow';
import DataTableCell from 'react-native-paper/lib/commonjs/components/DataTable/DataTableCell';

class AllRecapitulationScreen extends React.Component {

    state = {
        isOpen: false,
        url: null,
        semester: 'ganjil',
        year: '2021',
        waiting: true,
        dateStart: new Date(),
        dateEnd: new Date(),
        showStart: false,
        showEnd: false,
        selectedIndex: 0,
        showBy: 'day',
        windowWidth: Dimensions.get('window').width,
        windowHeight: Dimensions.get('window').height
    }
    componentDidMount = () => {
        this.startingHomeData()
    }

    startingHomeData = async (useDate = false) => {
        const { actions } = this.props;
        const { semester, year, dateStart, dateEnd } = this.state;

        setTimeout(() => {
            this.setState({
                waiting: true
            })
        }, 0)
        if (useDate) {
            await actions.getAllRecapitulationParent(dateStart, dateEnd, useDate);
        } else {
            await actions.getAllRecapitulationParent(semester, year);
        }
        setTimeout(() => {
            this.setState({
                waiting: false
            })
        }, 500)

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

    setImage = (url) => {
        this.setState({
            url,
            isOpen: true
        })
    }

    closeOverlay = () => {
        this.setState({
            isOpen: false
        })
    }


    submitFrom = (from) => {
        if (from.submit_from_admin) {
            return 'absensi terakhir diupdate oleh admin'
        }
        if (from.submit_from_teacher) {
            return 'absensi terakhir diupdate oleh guru'
        }
        if (from.submit_from_parent) {
            return 'absensi terakhir diupdate oleh orang tua'
        }
    }

    reverseString = (string) => {
        if (string) {
            return moment(Date.parse(string)).format('DD-MM-YYYY')
        }
        return null
    }

    setSemester = (semester) => {
        this.setState({
            semester
        })
    }

    setYear = (year) => {
        this.setState({
            year
        })
    }

    updateIndex(selectedIndex) {
        this.setState({
            selectedIndex
        })
    }

    onChangeDateStart = (val) => {
        this.setState({
            dateStart: new Date(val.nativeEvent.timestamp),
            showStart: false
        })
    }

    onChangeDateEnd = (val) => {
        this.setState({
            dateEnd: new Date(val.nativeEvent.timestamp),
            showEnd: false
        })
    }

    openDateStart = () => {
        setTimeout(() =>
            this.setState({ showStart: !this.state.showStart }), 0
        )
    }

    openDateEnd = () => {
        setTimeout(() =>
            this.setState({ showEnd: !this.state.showEnd }), 0
        )
    }

    recapPerday = () => {
        const { allRecap } = this.props;

        let totalAbsent = 0;
        let totalSakit = 0;
        let totalIzin = 0;
        let totalLainnya = 0;

        if (allRecap) {
            totalAbsent = allRecap.filter(val => val.reason == 'absen').length
            totalSakit = allRecap.filter(val => val.reason == 'sakit').length
            totalIzin = allRecap.filter(val => val.reason == 'izin').length
            totalLainnya = allRecap.filter(val => val.reason == 'lainnya').length
        }
        return (
            <>
                <Card>
                    <DataTable>
                        <DataTableHeader>
                            <DataTableTitle>Absen</DataTableTitle>
                            <DataTableTitle>Sakit</DataTableTitle>
                            <DataTableTitle>Izin</DataTableTitle>
                            <DataTableTitle>Lainnya</DataTableTitle>
                        </DataTableHeader>
                        <DataTableRow>
                            <DataTableCell>
                                {totalAbsent}
                            </DataTableCell>
                            <DataTableCell>
                                {totalSakit}
                            </DataTableCell>
                            <DataTableCell>
                                {totalIzin}
                            </DataTableCell>
                            <DataTableCell>
                                {totalLainnya}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTable>
                </Card>
                <Card>
                    <View>
                        {
                            !_.isEmpty(allRecap) ? (allRecap.map((l, i) => (
                                <View key={i}>
                                    <View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Tanggal
                            </Text>
                                            <Text style={{ margin: 10 }} >
                                                {this.reverseString(l.date_absent)}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Nama
                            </Text>
                                            <Text style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                                                {l.user.name}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Mapel
                            </Text>
                                            <Text style={{ margin: 10 }} >
                                                {l.schedule.subject.name}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Alasan
                            </Text>
                                            <Text style={{ margin: 10 }} >
                                                {l.reason}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Gambar
                            </Text>
                                            <Text style={{ margin: 10 }} >
                                                {
                                                    l.image ? (<Text onPress={() => this.setImage('https://pinterusmedia.com/storage/user/absent/' + l.user.id + '/' + l.image)}
                                                        style={{ color: 'blue', textDecorationLine: 'underline' }}>lihat gambar</Text>) : null
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ margin: 20, flex: 1, flexWrap: 'wrap' }}>{l.description ? l.description : null}</Text>
                                    <Text style={{ textAlign: 'center', color: 'grey', marginTop: 20 }}>
                                        {this.submitFrom({
                                            submit_from_admin: l.submit_from_admin,
                                            submit_from_parent: l.submit_from_parent,
                                            submit_from_teacher: l.submit_from_teacher
                                        })}
                                    </Text>
                                    <Card.Divider style={{ marginTop: 10 }} />
                                </View>
                            ))) : (<EmptyText />)
                        }
                    </View>
                </Card>
            </>
        );
    }

    recapPerSemester = () => {
        const { semester } = this.state;
        const { allRecap } = this.props;
        console.log(allRecap);
        let totalAbsentGen = 0;
        let totalSakitGen = 0;
        let totalIzinGen = 0;
        let totalLainnyaGen = 0;

        if (allRecap) {
            totalAbsentGen = allRecap.filter(val => val.reason == 'absen').length
            totalSakitGen = allRecap.filter(val => val.reason == 'sakit').length
            totalIzinGen = allRecap.filter(val => val.reason == 'izin').length
            totalLainnyaGen = allRecap.filter(val => val.reason == 'lainnya').length
        }
        return (
            <>
                {semester == 'ganjil' && (<Card>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ margin: 10, width: 100 }}>
                            Semester
                            </Text>
                        <Text style={{ margin: 10 }} >
                            GANJIL
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ margin: 10, width: 100 }}>
                            Tahun Ajaran
                            </Text>
                        <Text style={{ margin: 10 }} >
                            2021
                        </Text>
                    </View>
                    <DataTable>
                        <DataTableHeader>
                            <DataTableTitle>Absen</DataTableTitle>
                            <DataTableTitle>Sakit</DataTableTitle>
                            <DataTableTitle>Izin</DataTableTitle>
                            <DataTableTitle>Lainnya</DataTableTitle>
                        </DataTableHeader>
                        <DataTableRow>
                            <DataTableCell>
                                {totalAbsentGen}
                            </DataTableCell>
                            <DataTableCell>
                                {totalSakitGen}
                            </DataTableCell>
                            <DataTableCell>
                                {totalIzinGen}
                            </DataTableCell>
                            <DataTableCell>
                                {totalLainnyaGen}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTable>
                </Card>)}
                {
                    semester == 'genap' && (<Card>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ margin: 10, width: 100 }}>
                                Semester
                            </Text>
                            <Text style={{ margin: 10 }} >
                                GENAP
                        </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ margin: 10, width: 100 }}>
                                Tahun Ajaran
                            </Text>
                            <Text style={{ margin: 10 }} >
                                2021
                        </Text>
                        </View>
                        <DataTable>
                            <DataTableHeader>
                                <DataTableTitle>Absen</DataTableTitle>
                                <DataTableTitle>Sakit</DataTableTitle>
                                <DataTableTitle>Izin</DataTableTitle>
                                <DataTableTitle>Lainnya</DataTableTitle>
                            </DataTableHeader>
                            <DataTableRow>
                                <DataTableCell>
                                    {totalAbsentGen}
                                </DataTableCell>
                                <DataTableCell>
                                    {totalSakitGen}
                                </DataTableCell>
                                <DataTableCell>
                                    {totalIzinGen}
                                </DataTableCell>
                                <DataTableCell>
                                    {totalLainnyaGen}
                                </DataTableCell>
                            </DataTableRow>
                        </DataTable>
                    </Card>)
                }
            </>
        );
    }

    setShowBy = (showBy) => {
        this.setState({ showBy })
    }
    render() {
        const { isOpen, windowHeight, windowWidth,
            url, semester, year, waiting,
            selectedIndex, showStart, showEnd, showBy,
            dateStart, dateEnd } = this.state;
        const images = [{ url }];
        const buttons = ['semester', 'tanggal'];

        return (
            <>
                <ScrollView style={
                    {
                        height: '100%',
                        padding: 5,
                        backgroundColor: '#f0f0f0'
                    }}
                >

                    {isOpen && (<Overlay isVisible={isOpen}>
                        <View style={{ width: (windowWidth - 50), height: windowHeight - 100 }}>
                            <ImageViewer imageUrls={images} style={{ background: 'white' }} />
                        </View>
                        <Button title="tutup" onPress={() => this.closeOverlay()} />
                    </Overlay>)}

                    {showStart && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateStart}
                            mode={"date"}
                            display="default"
                            onChange={(val) => this.onChangeDateStart(val)}
                        />
                    )}

                    {showEnd && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date()}
                            mode={"date"}
                            display="default"
                            onChange={(val) => this.onChangeDateEnd(val)}
                        />
                    )}

                    <View style={{ marginBottom: 50 }}>
                        <View style={{ margin: 15 }}>
                            <Text style={{ padding: 10 }}>filter</Text>
                            <ButtonGroup
                                onPress={(val) => this.updateIndex(val)}
                                selectedIndex={selectedIndex}
                                buttons={buttons}
                                containerStyle={{ height: 35, marginBottom: 20 }}
                            />
                            {
                                selectedIndex == 0 ? <>
                                    <Picker
                                        style={{
                                            height: 25,
                                            width: '100%',
                                        }}
                                        selectedValue={semester}
                                        onValueChange={(itemValue) => {
                                            this.setSemester(itemValue)
                                        }}>
                                        <Picker.Item label="SEMESTER GANJIL" value="ganjil" />
                                        <Picker.Item label="SEMESTER GENAP" value="genap" />
                                    </Picker>
                                    <Picker
                                        style={{
                                            height: 25,
                                            width: '100%',
                                            marginTop: 20,
                                            marginBottom: 20
                                        }}
                                        selectedValue={year}
                                        onValueChange={(itemValue) => {
                                            this.setYear(itemValue)
                                        }}>
                                        <Picker.Item label="TAHUN 2021" value="2021" />
                                    </Picker>
                                </> : <View style={{ marginBottom: 15, paddingHorizontal: 10 }}>
                                        <View flexDirection="row" style={{ flex: 1, justifyContent: 'space-between' }}>
                                            <Text style={{ margin: 10, marginLeft: 0 }}>Dari Tanggal</Text>
                                            <Text style={{ margin: 10, marginLeft: 0, color: 'grey' }}>{moment(dateStart).format("DD/MM/YYYY")}</Text>
                                            <Button title="Pilih" onPress={() => this.openDateStart()} />
                                        </View>
                                        <View flexDirection="row" style={{ marginTop: 10, flex: 1, justifyContent: 'space-between' }}>
                                            <Text style={{ margin: 10, marginLeft: 0 }}>Sampai Tanggal</Text>
                                            <Text style={{ margin: 10, marginLeft: 0, color: 'grey' }}>{moment(dateEnd).format("DD/MM/YYYY")}</Text>
                                            <Button title="pilih" onPress={() => this.openDateEnd()} />
                                        </View>
                                    </View>
                            }

                            <Picker
                                style={{
                                    height: 25,
                                    width: '100%',
                                    marginBottom: 20
                                }}
                                selectedValue={showBy}
                                onValueChange={(itemValue) => {
                                    this.setShowBy(itemValue)
                                }}>
                                <Picker.Item label="TAMPILKAN PER HARI" value="day" />
                                <Picker.Item label="TAMPILKAN PER SEMESTER" value="semstr" />
                            </Picker>
                            {
                                selectedIndex == 0 ? <Button
                                    onPress={() => this.startingHomeData()}
                                    title="Terapkan" /> : <Button
                                        onPress={() => this.startingHomeData(true)}
                                        title="Terapkan" />
                            }
                        </View>
                        {
                            waiting ? <Text style={{ padding: 15, paddingTop: 5 }}>Tunggu sebentar...</Text> :
                                (
                                    <View>
                                        { showBy == 'day' ? this.recapPerday() : this.recapPerSemester()}
                                    </View>
                                )
                        }
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


