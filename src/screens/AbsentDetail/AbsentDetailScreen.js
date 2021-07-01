import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import { Card, ListItem, Overlay, Text, Badge, Image } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer'
import _ from 'lodash';
import { getAllRecapitulationParent } from '../../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmptyText from '../../components/EmptyText';
import { Button } from 'react-native';
import { DataTable } from 'react-native-paper';

class AbsentDetailScreen extends React.Component {

    state = {
        isOpen: false,
        url: null,
        params: null,
        windowWidth: Dimensions.get('window').width,
        windowHeight: Dimensions.get('window').height
    }
    componentDidMount = () => {
        this.startingHomeData()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        this.setState({
            params: this.props.route.params
        })
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
        const { isOpen, windowHeight, windowWidth, url, params } = this.state;
        const { allRecap } = this.props;
        const images = [{
            url
        }]
        const date = new Date();
        const numberdate = date.get
        const tahun = date.getFullYear();
        const bulan = date.getMonth();
        const tanggal = date.getDate();
        const hari = date.getDay();
        const jam = date.getHours();
        const menit = date.getMinutes();
        const detik = date.getSeconds();


        console.log(params);
        return (
            <>
                <ScrollView style={
                    {
                        height: '100%',
                        padding: 5,
                        backgroundColor: '#f0f0f0'
                    }}
                >
                    <Overlay isVisible={isOpen}>
                        <View style={{ width: (windowWidth - 50), height: windowHeight - 100 }}>
                            <ImageViewer imageUrls={images} style={{ background: 'white' }} />
                        </View>
                        <Button title="tutup" onPress={() => this.closeOverlay()} />
                    </Overlay>
                    <View style={{ marginBottom: 50 }}>
                        <Card>
                            <View>
                                {params ? <>
                                    <View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Tanggal
                                            </Text>
                                            <Text style={{ margin: 10 }} >
                                                {params.date_absent}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Nama
                                            </Text>
                                            <Text style={{ margin: 10, flex: 1, flexWrap: 'wrap' }}>
                                                {params.user.name}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Status
                                            </Text>
                                            <Text style={{ margin: 10 }} >
                                                {params.reason}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ margin: 10, width: 100 }}>
                                                Gambar
                                            </Text>
                                            <Text style={{ margin: 10 }} >
                                                {
                                                    params.image ? (<Text onPress={() => this.setImage('https://pinterusmedia.com/storage/user/absent/' + params.user.id + '/' + params.image)}
                                                        style={{ color: 'blue', textDecorationLine: 'underline' }}>lihat gambar</Text>) : <Text style={{ color: 'grey' }}>(tidak ada gambar)</Text>
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ margin: 10, width: 100 }}>
                                            Penjelasan
                                            </Text>
                                        <Text style={{ margin: 10, flex: 1, flexWrap: 'wrap' }} >
                                            {params.description ? params.description : <Text style={{ color: 'grey' }}>(kosong)</Text>}
                                        </Text>
                                    </View>
                                    <Text style={{ textAlign: 'center', color: 'grey', marginTop: 20 }}>
                                        {this.submitFrom({
                                            submit_from_admin: params.submit_from_admin,
                                            submit_from_parent: params.submit_from_parent,
                                            submit_from_teacher: params.submit_from_teacher
                                        })}
                                    </Text>
                                </> : null}
                                {/* {
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
                                                {
                                                    l.description ? (<Text style={{ width: '100%', fontSize: 17, padding: 10, marginBottom: 10, backgroundColor: '#F4f4f4' }}>
                                                        {l.description}
                                                    </Text>) : null
                                                }
                                                {
                                                    l.image ? (<Text onPress={() => this.setImage('https://pinterusmedia.com/storage/user/absent/' + l.user.id + '/' + l.image)}
                                                        style={{ color: 'blue', textDecorationLine: 'underline' }}>lihat gambar</Text>) : null
                                                }
                                            </ListItem.Content>
                                        </ListItem>
                                    ))) : (<EmptyText />)
                                } */}
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </>
        )
    }

}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getAllRecapitulationParent,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AbsentDetailScreen);


