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
import moment from 'moment';

class AllRecapitulationScreen extends React.Component {

    state = {
        isOpen: false,
        url: null,
        windowWidth: Dimensions.get('window').width,
        windowHeight: Dimensions.get('window').height
    }
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

    render() {
        const { isOpen, windowHeight, windowWidth, url } = this.state;
        const { allRecap } = this.props;
        const images = [{
            url
        }]

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
                                                {/* <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ margin: 10, width: 100 }}>
                                                        Guru
                                                    </Text>
                                                    <Text style={{ margin: 10 }} >
                                                        {l.schedule.user}
                                                    </Text>
                                                </View> */}
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
                                        // <ListItem key={i} bottomDivider>
                                        //     <ListItem.Content>
                                        //         <ListItem.Title style={{ color: '#000' }}>
                                        //             <Text style={{ fontSize: 17 }}>
                                        //                 {l.date_absent} - semester {l.schedule.semester}
                                        //             </Text>
                                        //         </ListItem.Title>
                                        //         <ListItem.Subtitle>
                                        //             <Badge
                                        //                 badgeStyle={{ marginVertical: 10, padding: 15 }}
                                        //                 status="success"
                                        //                 value={<Text style={{ fontSize: 15, color: 'white' }}>
                                        //                     {l.schedule.subject.name}
                                        //                 </Text>}
                                        //             />
                                        //             <Badge
                                        //                 badgeStyle={{ marginVertical: 10, marginHorizontal: 10, padding: 15 }}
                                        //                 status={this.getColorBadge(l.reason)}
                                        //                 value={<Text style={{ fontSize: 15, color: 'white' }}>
                                        //                     {l.reason}
                                        //                 </Text>}
                                        //             />
                                        //         </ListItem.Subtitle>
                                        //         {
                                        //             l.description ? (<Text style={{ width: '100%', fontSize: 17, padding: 10, marginBottom: 10, backgroundColor: '#F4f4f4' }}>
                                        //                 {l.description}
                                        //             </Text>) : null
                                        //         }
                                        //         {
                                        //             l.image ? (<Text onPress={() => this.setImage('https://pinterusmedia.com/storage/user/absent/' + l.user.id + '/' + l.image)}
                                        //                 style={{ color: 'blue', textDecorationLine: 'underline' }}>lihat gambar</Text>) : null
                                        //         }
                                        //     </ListItem.Content>
                                        // </ListItem>
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


